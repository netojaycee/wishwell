// Stable, square raster logo at /logo.png for schema.org Organization.logo, Google wants a
// crawlable PNG/JPG ≥112px at a fixed URL (the app icon's URL carries a build hash, and SVG
// isn't accepted). Same open-heart mark as components/brand/logo-mark.tsx. Prerendered.
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDF8EE",
        }}
      >
        <svg width="320" height="320" viewBox="0 0 100 100" fill="none">
          <path
            d="M35,18 C20,15 8,25 8,40 C8,58 26,73 47,88 C50,90 50,90 53,88 C74,73 92,58 92,40 C92,25 80,15 65,18"
            stroke="#C4713F"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle cx="50" cy="18" r="9" fill="#C4713F" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 }
  );
}
