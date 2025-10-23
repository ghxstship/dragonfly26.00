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
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
        ],
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://www.npmjs.com/package/@sentry/webpack-plugin#options

    org: "g-h-x-s-t-s-h-i-p-industries-l",
    project: "atlvs",

    // Only print logs for uploading source maps in CI
    silent: !process.env.CI,

    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
    // This can increase your server load as well as your hosting bill.
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: "/monitoring",

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
