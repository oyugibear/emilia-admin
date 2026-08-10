import type { NextConfig } from "next";

const apiProxyTarget = process.env.API_PROXY_TARGET?.trim().replace(/\/$/, "");

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiProxyTarget) {
      return [];
    }

    return [
      {
        source: "/api/v1/:path*",
        destination: `${apiProxyTarget}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
