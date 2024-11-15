/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["medh-documents.s3.amazonaws.com"],
  },
};

export default nextConfig;
