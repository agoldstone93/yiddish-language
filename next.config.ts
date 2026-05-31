import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return [
      // Decap CMS static entrypoint (public/admin/index.html)
      { source: "/admin", destination: "/admin/index.html" },
      { source: "/admin/", destination: "/admin/index.html" },
      { source: "/counter/:path*", destination: "https://adamgoldstone.goatcounter.com/counter/:path*" },
    ];
  },
};

export default nextConfig;