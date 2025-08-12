/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  staticPageGenerationTimeout: 1800,
  generateBuildId: async () => `build-${Date.now()}`,

  // ✅ Inject environment variables from Amplify or shell
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    API_KEY_SALT: process.env.API_KEY_SALT,
    SESSION_SECRET: process.env.SESSION_SECRET,
    MONGO_URI: process.env.MONGO_URI,
    NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  },

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
  transpilePackages: [
    '@floating-ui/core',
    '@floating-ui/dom',
    '@floating-ui/react-dom',
    '@radix-ui/react-roving-focus',
    'react-remove-scroll',
    '@jridgewell/resolve-uri'
  ],
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'medh-documents.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'medhdocuments.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'example.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.cloudfront.net' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.jsdelivr.net' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: 'esampark.us' },
      { protocol: 'https', hostname: 'medh.co' },
      { protocol: 'http', hostname: 'localhost', port: '3000' },
      { protocol: 'https', hostname: 'api.medh.co' }
    ],
    deviceSizes: [400, 600, 800, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 400, 600, 800],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
    loader: 'default',
  },
  productionBrowserSourceMaps: false,

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
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
};

export default nextConfig;
