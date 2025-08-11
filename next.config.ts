import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 성능 최적화
  compress: true,
  
  // 이미지 최적화
  images: {
    domains: [],
    formats: ["image/avif", "image/webp"],
  },
  
  // 웹 표준 준수
  poweredByHeader: false,
  
  // React Strict Mode
  reactStrictMode: true,
};

export default nextConfig;
