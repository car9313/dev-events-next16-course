import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        // Añade pathname si es necesario
        pathname: '/**',
      }, {
        protocol: 'https',
        hostname: 'images.unsplash.com',  // ← Agrega esto
      }
    ]
  },
};

export default nextConfig;