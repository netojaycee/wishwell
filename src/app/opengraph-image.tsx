// Default OG image for any page that doesn't define its own (boards have their own
// dynamic one at b/[slug]/opengraph-image.tsx). Without this, pages like the homepage
// had no og:image at all, so link previews (WhatsApp, Slack, iMessage) fell back to
// nothing or a generic platform placeholder.
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#FDF8EE",
          padding: 80,
        }}
      >
        <svg width="96" height="96" viewBox="0 0 100 100" fill="none">
          <path
            d="M35,18 C20,15 8,25 8,40 C8,58 26,73 47,88 C50,90 50,90 53,88 C74,73 92,58 92,40 C92,25 80,15 65,18"
            stroke="#C4713F"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <circle cx="50" cy="18" r="7" fill="#C4713F" />
        </svg>
        <div style={{ display: "flex", marginTop: 28, fontSize: 64, fontWeight: 600, color: "#241C0A" }}>
          Fondly Held
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 28, color: "#8A6E3E", textAlign: "center" }}>
          Beautiful group cards for every occasion
        </div>
      </div>
    ),
    size
  );
}
