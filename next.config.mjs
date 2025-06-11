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
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
  },
  // Removed experimental features that might cause issues
  webpack: (config, { dev, isServer }) => {
    // Exclude problematic CSS files from regular CSS processing
    // Add a rule to handle the CSS files specially
    config.module.rules.push({
      test: /node_modules[\/\\](rc-time-picker|react-datepicker|react-phone-input-2|react-quill|react-toastify|slick-carousel)[\/\\].+\.css$/,
      // Use null loader for server-side
      use: isServer 
        ? ['null-loader'] 
        : ['style-loader', 'css-loader'],
      type: 'javascript/auto',
    });

    // For Next.js app dir, these CSS files need to be excluded from default CSS handling
    if (config.module.rules) {
      const cssRule = config.module.rules.find(
        (rule) => rule.oneOf && rule.oneOf.find((r) => r.test && r.test.toString().includes('\\.css'))
      );

      if (cssRule) {
        const cssRules = cssRule.oneOf;
        if (cssRules) {
          for (const rule of cssRules) {
            if (rule.test && rule.test.toString().includes('\\.css')) {
              if (!rule.exclude) rule.exclude = [];
              if (Array.isArray(rule.exclude)) {
                rule.exclude.push(/node_modules[\/\\](rc-time-picker|react-datepicker|react-phone-input-2|react-quill|react-toastify|slick-carousel)[\/\\].+\.css$/);
              }
            }
          }
        }
      }
    }

    if (!dev && !isServer) {
      // Optimize production builds
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

    return config;
  },
  // Enable production source maps for better debugging
  productionBrowserSourceMaps: true,
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
