// Dynamic OG image per board, what actually renders when a board link is shared into
// WhatsApp or Slack. ARCHITECTURE.md: "materially drives click-through, do not skip it."
import { ImageResponse } from "next/og";
import { getBoardBySlug } from "@/lib/data/boards";
import { countPublishedPosts } from "@/lib/data/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);

  if (!board) {
    return new ImageResponse(<div style={{ width: "100%", height: "100%", background: "#fff" }} />, size);
  }

  const postCount = await countPublishedPosts(board.id);
  const { bg, ink, accent, accentSoft, surface } = board.theme.palette;
  // The recipient's main photo makes the WhatsApp/Slack preview instantly recognisable.
  // Only formats Satori can decode (recipient uploads are shrunk to JPEG in the browser).
  const photo = board.recipientPhotos.find((url) => /\.(jpe?g|png)$/i.test(url));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          padding: 80,
          gap: 64,
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt=""
            width={330}
            height={420}
            style={{ objectFit: "cover", borderRadius: 36, border: `10px solid ${surface}`, transform: "rotate(-3deg)" }}
          />
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: photo ? "flex-start" : "center",
            maxWidth: photo ? 640 : 1040,
          }}
        >
        <div
          style={{
            display: "flex",
            padding: "8px 20px",
            borderRadius: 999,
            background: accentSoft,
            color: accent,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          {board.occasionType.label}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 68,
            fontWeight: 600,
            color: ink,
            textAlign: photo ? "left" : "center",
            lineHeight: 1.15,
          }}
        >
          {board.title}
        </div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: accent }}>
          {postCount} {postCount === 1 ? "message" : "messages"} · Fondly Held
        </div>
        </div>
      </div>
    ),
    size
  );
}
