/** @type {import('next').NextConfig} */
import crypto from 'crypto';

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

  // Disable source maps in production to save memory
  productionBrowserSourceMaps: false,
  
  // Optimize build output
  output: 'standalone', // Reduce bundle size
  
  // Prevent build cancellation with longer timeout
  staticPageGenerationTimeout: 3600, // 60 minutes
  generateBuildId: async () => {
    // Generate a unique build ID to prevent caching issues
    return `build-${Date.now()}`
  },

  // SWC Configuration for AWS CodeBuild compatibility
  ...(process.env.SWC_DISABLE_NEXT_SWC === '1' ? {} : {
    compiler: {
      // Allow graceful fallback to Babel if SWC fails
      removeConsole: process.env.NODE_ENV === 'production' ? {
        exclude: ['error', 'warn'],
      } : false,
      // Remove React DevTools in production
      reactRemoveProperties: process.env.NODE_ENV === 'production',
    },
  }),

  // Consolidated experimental settings with memory optimization
  experimental: {
    // Memory optimization
    memoryBasedWorkersCount: true,
    workerThreads: false, // Disable worker threads to save memory
    
    // SWC disable settings for CI environments
    ...(process.env.CI && process.env.SWC_DISABLE_NEXT_SWC === '1' && {
      forceSwcTransforms: false,
      swcPlugins: [],
      optimizePackageImports: [],
    }),
    // Reduced package imports to save memory
    ...(!process.env.CI || process.env.SWC_DISABLE_NEXT_SWC !== '1') && {
      optimizePackageImports: [
        '@radix-ui/react-avatar',
        '@radix-ui/react-progress',
        '@heroicons/react',
        'lucide-react',
      ],
    },
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

  // Enhanced webpack optimizations for memory efficiency
  webpack: (config, { dev, isServer, webpack }) => {
    // Memory optimization for production builds
    if (!dev) {
      // Reduce memory usage during build
      config.optimization = {
        ...config.optimization,
        // Minimize memory usage
        minimize: true,
        // Better tree shaking
        usedExports: true,
        sideEffects: false,
        // Reduce chunk overhead
        concatenateModules: true,
        // Memory-efficient chunk splitting
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 250000,
          cacheGroups: {
            framework: {
              chunks: 'all',
              name: 'framework',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
              },
              name(module) {
                const hash = crypto.createHash('sha1');
                if (module.libIdent) {
                  hash.update(module.libIdent({ context: config.context }));
                } else {
                  hash.update(module.identifier());
                }
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name: 'shared',
              minChunks: 1,
              priority: 10,
              reuseExistingChunk: true,
            },
          },
        },
      };

      // Add memory-efficient plugins
      config.plugins.push(
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 50, // Limit chunks to reduce memory usage
        })
      );

      // Resolve optimization
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

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


