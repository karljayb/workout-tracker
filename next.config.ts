import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  webpack: (config, { isServer }) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...config.resolve?.fallback,
        fs: false,
      }
    };
    
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname)
    };
    
    return config;
  }
};

export default nextConfig;
