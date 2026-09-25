import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Product / hero images come from the Express API (localhost, Render, etc.)
  // and from user-supplied https URLs, so allow remote images everywhere.
  // Narrow this to your domains for stricter CSP in production.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

export default nextConfig;

