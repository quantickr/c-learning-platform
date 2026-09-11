import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone', // Для Docker и самостоятельного деплоя
};

export default nextConfig;
