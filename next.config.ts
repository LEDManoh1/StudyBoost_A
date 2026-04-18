import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Set to true in production to catch linting errors during build
    ignoreDuringBuilds: process.env.VERCEL_ENV === "production" ? false : true,
  },
  typescript: {
    // Set to true in production to catch type errors during build
    ignoreBuildErrors: process.env.VERCEL_ENV === "production" ? false : true,
  },
  // Optimizations for Vercel
  productionBrowserSourceMaps: false,
};

export default nextConfig;
