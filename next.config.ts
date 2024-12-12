import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  webpack: (config) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
      },
      alias: {
        ...config.resolve?.alias,
        '@': '.'
      }
    };
    return config;
  },
};

export default nextConfig;
