/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output directory for marketing site
  distDir: '.next-marketing',
  
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
        destination: 'https://app.atlvs.xyz',
      },
      {
        source: '/app/:path*',
        destination: 'https://app.atlvs.xyz/:path*',
      },
    ]
  },

  // Redirects for auth pages
  async redirects() {
    return [
      {
        source: '/signup',
        destination: 'https://app.atlvs.xyz/en/signup',
        permanent: false,
      },
      {
        source: '/signin',
        destination: 'https://app.atlvs.xyz/en/login',
        permanent: false,
      },
      {
        source: '/login',
        destination: 'https://app.atlvs.xyz/en/login',
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

module.exports = nextConfig
