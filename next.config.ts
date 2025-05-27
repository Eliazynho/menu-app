import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "example.com",
      "images.tcdn.com.br",
      "static.ifood-static.com.br",
      "static.vecteezy.com",
    ], // Adicione o domínio específico aqui
  },
};

export default nextConfig;
