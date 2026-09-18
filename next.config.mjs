/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["gnion-market.p-e.kr"],
  experimental: {
    serverActions: {
      bodySizeLimit: "26mb",
    },
  },
};

export default nextConfig;
