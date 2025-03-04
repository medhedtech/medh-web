/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Suppress punycode warning
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        punycode: false,
      };
    }
    
    // Add optimization for production builds
    if (process.env.NODE_ENV === 'production') {
      // Optimize CSS
      const optimization = config.optimization || {};
      config.optimization = {
        ...optimization,
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: Infinity,
          minSize: 20000,
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // Get the name of the package
                const match = module.context ? module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/) : null;
                // Return a nice package name or a default if match is null
                return match ? `npm.${match[1].replace('@', '')}` : 'npm.vendor';
              },
            },
          },
        },
      };
    }
    
    return config;
  },
};

export default nextConfig;
