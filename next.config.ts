import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.paldb.cc',
        pathname: '/image/**',
      },
    ],
  },
};

export default nextConfig;
