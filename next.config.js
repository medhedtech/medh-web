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

  output: 'standalone', // ✅ Required for Amplify/Serverless

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

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'medh-documents.s3.amazonaws.com' },
      { protocol: 'https', hostname: 'medhdocuments.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: '*.cloudfront.net' },
      { protocol: 'https', hostname: 'medh.co' },
    ],
    deviceSizes: [400, 600, 800, 1200, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 128, 256, 400, 600, 800],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  productionBrowserSourceMaps: false,

  webpack: (config) => {
    config.resolve.fallback = { fs: false, path: false, os: false };
    return config;
  },
};

module.exports = nextConfig;
