import type { NextConfig } from "next";

const r2PublicHost = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Contributor GIFs (Giphy) and owner-uploaded media (R2), once configured.
      { protocol: "https", hostname: "media*.giphy.com" },
      ...(r2PublicHost ? [{ protocol: "https" as const, hostname: r2PublicHost }] : []),
    ],
  },
};

export default nextConfig;
