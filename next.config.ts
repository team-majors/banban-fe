import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'axjvrbminfbt.compat.objectstorage.ap-chuncheon-1.oraclecloud.com',
      },
    ],
  },
};

export default nextConfig;
