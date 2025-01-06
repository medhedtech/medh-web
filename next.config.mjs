/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    // domains: ["medh-documents.s3.amazonaws.com"],
    domains: ["medh-documents.s3.amazonaws.com"]
    // domains: ["medhdocuments.s3.ap-south-1.amazonaws.com"],
  },
};

export default nextConfig;
