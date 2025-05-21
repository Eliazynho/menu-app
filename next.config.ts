import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["example.com", "images.tcdn.com.br"], // Adicione aqui os domínios permitidos
  },
};

export default nextConfig;
