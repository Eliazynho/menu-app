import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "example.com",
      "images.tcdn.com.br",
      "static.ifood-static.com.br",
      "static.vecteezy.com",
      "encrypted-tbn0.gstatic.com",
      "upload.wikimedia.org",
      "static.ifood-static.com.br",
    ], // Adicione o domínio específico aqui
  },
};

export default nextConfig;
