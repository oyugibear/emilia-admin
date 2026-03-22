import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.trim() || "";

const nextConfig: NextConfig = {
  // Support deployments where the admin app is served from a sub-path (e.g. /admin).
  // This prevents client-side navigations like /dashboard from resolving to the domain root.
  ...(basePath
    ? {
        basePath,
        assetPrefix: basePath,
      }
    : {}),
};

export default nextConfig;
