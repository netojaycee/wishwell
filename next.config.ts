import type { NextConfig } from "next";

const r2PublicHost = process.env.R2_PUBLIC_URL ? new URL(process.env.R2_PUBLIC_URL).hostname : undefined;

const nextConfig: NextConfig = {
  images: {
    // Serve images as-is instead of through Vercel's Image Optimization: on the Hobby
    // plan its quota ran out and every /_next/image request returned 402 "Payment
    // Required", breaking all photos in production (marketing AND contributor uploads).
    // Our own photos are pre-sized WebPs in /public/images/moments; uploads come
    // straight from R2 (no egress fees). Revisit with a custom loader if needed.
    unoptimized: true,
    remotePatterns: [
      // Contributor GIFs (Giphy) and owner-uploaded media (R2), once configured.
      { protocol: "https", hostname: "media*.giphy.com" },
      ...(r2PublicHost ? [{ protocol: "https" as const, hostname: r2PublicHost }] : []),
    ],
  },
};

export default nextConfig;
