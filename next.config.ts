import type { NextConfig } from "next";

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
    
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': '.'
      };
    }
    
    return config;
  }
};

export default nextConfig;
