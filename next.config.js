const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core performance optimizations
  compress: true,
  poweredByHeader: false,
  
  eslint: {
    // ESLint warnings don't fail the build (standard for production)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // TypeScript errors will fail the build (strict mode)
    ignoreBuildErrors: false,
  },
  
  // Optimized image configuration
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // 1 year
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  
  // Experimental performance features
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-popover',
    ],
    serverActions: {
      allowedOrigins: ['localhost:3000'],
      bodySizeLimit: '2mb',
    },
  },
  
  // Modular imports for better tree-shaking
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  
  // Enhanced webpack optimization
  webpack: (config, { isServer, dev }) => {
    if (!isServer && !dev) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            
            // Framework bundle (React, Next.js)
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            
            // Radix UI components
            radix: {
              test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
              name: 'radix-ui',
              priority: 30,
              enforce: true,
            },
            
            // Supabase
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'supabase',
              priority: 25,
              enforce: true,
            },
            
            // Vendor libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 20,
              minSize: 20000,
              maxSize: 244000,
            },
            
            // Common code
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 10,
            },
          },
        },
      }
    }
    return config
  },
}

module.exports = withBundleAnalyzer(withNextIntl(nextConfig))
