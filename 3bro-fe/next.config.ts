import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "localhost",
        port: "7041",
        pathname: "/Products/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "7041",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development',
  },


  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
