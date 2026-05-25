import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/sistema.html',
        permanent: false,
      },
    ]
  },
};

export default nextConfig;
