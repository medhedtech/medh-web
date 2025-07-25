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
  // Prevent build cancellation
  staticPageGenerationTimeout: 1800, // 30 minutes
  generateBuildId: async () => {
    // Generate a unique build ID to prevent caching issues
    return `build-${Date.now()}`
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
  
  // Explicit PostCSS configuration for Amplify builds
  experimental: {
    // Force PostCSS to use the config file
    forceSwcTransforms: false,
  },
  
  // Webpack configuration for better PostCSS handling
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Ensure PostCSS plugins are properly resolved
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    // Add explicit module resolution for Tailwind CSS
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    return config;
  },
};

export default nextConfig;


