/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },

  // SWC Configuration for AWS CodeBuild compatibility
  swcMinify: false, // Disable SWC minification as fallback
  compiler: {
    // Allow graceful fallback to Babel if SWC fails
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Prevent build cancellation
  staticPageGenerationTimeout: 1800, // 30 minutes
  generateBuildId: async () => {
    // Generate a unique build ID to prevent caching issues
    return `build-${Date.now()}`
  },

  // Updated experimental settings for better Turbopack stability
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: [
      '@radix-ui/react-avatar',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-label',
      '@radix-ui/react-progress',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-select',
      '@radix-ui/react-separator',
      '@radix-ui/react-slot',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@heroicons/react',
      'lucide-react',
      'react-icons',
    ],
    // Improve HMR performance
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // Move Turbopack configuration to the new stable location
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
    resolveAlias: {
      // Ensure consistent module resolution
      'react': 'react',
      'react-dom': 'react-dom',
    },
  },

  // Enhanced webpack optimizations for better HMR stability
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Improve HMR stability with better module resolution
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        chunkIds: 'named',
        // Prevent module factory deletion issues
        providedExports: true,
        sideEffects: false,
      };

      // Better source maps for debugging
      config.devtool = 'eval-source-map';

      // Prevent module resolution issues with absolute paths
      config.resolve.alias = {
        ...config.resolve.alias,
        'react': 'react',
        'react-dom': 'react-dom',
        'react/jsx-runtime': 'react/jsx-runtime',
        'react/jsx-dev-runtime': 'react/jsx-dev-runtime',
      };

      // Ensure consistent module resolution
      config.resolve.modules = ['node_modules', ...config.resolve.modules];

      // Optimize chunk splitting for HMR with better cache groups
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: 'all',
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
            enforce: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      };

      // Add HMR optimization plugins
      config.plugins = [
        ...config.plugins,
      ];
    }

    return config;
  },

  transpilePackages: [
    '@floating-ui/core',
    '@floating-ui/dom',
    '@floating-ui/react-dom',
    '@radix-ui/react-roving-focus',
    'react-remove-scroll',
    '@jridgewell/resolve-uri'
  ],
  // Don't specify output mode to use the default (which supports both static and dynamic routes)
  trailingSlash: true, // Add trailing slashes to improve compatibility
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'medh-documents.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'medhdocuments.s3.ap-south-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.jsdelivr.net',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'esampark.us',
      },
      {
        protocol: 'https',
        hostname: 'medh.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: 'api.medh.co',
      }
    ],
    // Optimized device sizes for course cards and LCP
    deviceSizes: [400, 600, 800, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 400, 600, 800],
    // Prioritize modern formats for better compression
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days for better caching
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable optimization for better LCP
    unoptimized: false,
    // Enable responsive images by default
    loader: 'default',
  },
  // Enable production source maps for better debugging
  productionBrowserSourceMaps: false, // Disable for faster builds
  // Add headers for better caching, security, and video optimization
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|png|webp|avif)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Video file headers for streaming optimization
      {
        source: '/:all*(mp4|webm|mov|avi|mkv|m3u8|ts|m4s)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=3600',
          },
          {
            key: 'Accept-Ranges',
            value: 'bytes',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
      // HLS manifest files
      {
        source: '/:all*(m3u8)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/vnd.apple.mpegurl',
          },
        ],
      },
      // DASH manifest files
      {
        source: '/:all*(mpd)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          {
            key: 'Content-Type',
            value: 'application/dash+xml',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Video streaming preconnect hints
          {
            key: 'Link',
            value: '</medh-videos.cloudfront.net>; rel=preconnect; crossorigin, </fonts.googleapis.com>; rel=preconnect; crossorigin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;


