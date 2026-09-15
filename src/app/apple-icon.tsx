import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
        <svg width="112" height="112" viewBox="0 0 100 100" fill="none">
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
    size
  );
}
