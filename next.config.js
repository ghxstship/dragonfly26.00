const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output directory for marketing site
  distDir: '.next-marketing',
  
  // Use marketing app directory
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    unoptimized: true, // Required for static export
  },
  
  // Optimizations
  compress: true,
  poweredByHeader: false,
  
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  
  // Rewrites to handle app subdomain routing
  async rewrites() {
    return [
      {
        source: '/app',
        destination: process.env.NEXT_PUBLIC_APP_URL || 'https://app.atlvs.one',
      },
      {
        source: '/app/:path*',
        destination: `${process.env.NEXT_PUBLIC_APP_URL || 'https://app.atlvs.one'}/:path*`,
      },
    ]
  },

  // Redirects for auth pages
  async redirects() {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.atlvs.one'
    return [
      {
        source: '/signup',
        destination: `${appUrl}/en/signup`,
        permanent: false,
      },
      {
        source: '/signin',
        destination: `${appUrl}/en/login`,
        permanent: false,
      },
      {
        source: '/login',
        destination: `${appUrl}/en/login`,
        permanent: false,
      },
    ]
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)
