"use client";

// Live mirror of how the post will actually render on the board (see
// components/board/post-card.tsx), updates as the contributor types, so writing a
// message feels like placing it on the card rather than filling out a form.
type Media = { url: string; type: "image" | "video" | "gif" } | null;

export function PostPreviewCard({
  authorName,
  body,
  media,
  accent,
  accentSoft,
}: {
  authorName: string;
  body: string;
  media: Media;
  accent: string;
  accentSoft: string;
}) {
  const hasMedia = Boolean(media);
  const hasContent = authorName.trim() || body.trim() || media;

  return (
    <div
      className="w-full max-w-xs rounded-2xl border border-black/5 shadow-lg transition-all duration-300"
      style={{
        background: hasMedia ? "var(--board-surface, #fff)" : accentSoft,
        transform: "rotate(-2deg)",
        opacity: hasContent ? 1 : 0.7,
      }}
    >
      {media ? (
        <div className="overflow-hidden rounded-t-2xl bg-black/5">
          {media.type === "video" ? (
            <video src={media.url} className="h-40 w-full object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element -- live client-side preview
            <img src={media.url} alt="" className="h-40 w-full object-cover" />
          )}
        </div>
      ) : null}

      <div className={hasMedia ? "p-5" : "p-7"}>
        <p
          className={hasMedia ? "text-[15px] leading-relaxed" : "text-lg leading-relaxed"}
          style={{ color: "var(--board-ink, #241c0a)" }}
        >
          {body.trim() || "Your message will look like this…"}
        </p>
        <p className="mt-4 text-sm font-medium" style={{ color: accent }}>
          {authorName.trim() || "Your name"}
        </p>
      </div>
    </div>
  );
}
