import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  // Disable ESLint and TypeScript checks during Docker build
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
