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
      }
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side specific configurations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
        stream: false,
        buffer: false,
      };
      
      // Apply optimizations for production builds
      if (process.env.NODE_ENV === 'production') {
        // Use standard optimization settings
        config.optimization = {
          ...config.optimization,
          runtimeChunk: {
            name: 'runtime',
          },
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              vendor: {
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                priority: -10,
                reuseExistingChunk: true,
              },
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true,
              },
            },
          },
        };
      }
    } else {
      // Server-side specific configurations
      config.output.globalObject = 'globalThis';
    }
    
    return config;
  },
  // Reduce build output size
  productionBrowserSourceMaps: false,
};

export default nextConfig;
