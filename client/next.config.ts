import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { VITE_TINYMCE_API_KEY: process.env.VITE_TINYMCE_API_KEY ?? "" },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'html.aqlova.com' }],
  },
};

export default nextConfig;
