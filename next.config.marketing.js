/** @type {import('next').NextConfig} */
const nextConfig = {
  // Marketing site specific configuration
  basePath: '',
  assetPrefix: process.env.NODE_ENV === 'production' ? 'https://atlvs.xyz' : '',
  
  // Output directory
  distDir: '.next-marketing',
  
  // Rewrites for app subdomain
  async rewrites() {
    return [
      {
        source: '/app',
        destination: 'https://app.atlvs.xyz/app',
      },
      {
        source: '/app/:path*',
        destination: 'https://app.atlvs.xyz/app/:path*',
      },
    ]
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/signup',
        destination: 'https://app.atlvs.xyz/auth/signup',
        permanent: false,
      },
      {
        source: '/signin',
        destination: 'https://app.atlvs.xyz/auth/signin',
        permanent: false,
      },
      {
        source: '/login',
        destination: 'https://app.atlvs.xyz/auth/signin',
        permanent: false,
      },
    ]
  },

  // Headers for security
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
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ]
  },

  // Image optimization
  images: {
    domains: ['atlvs.xyz'],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental features
  experimental: {
    optimizeCss: true,
  },

  // Production optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
