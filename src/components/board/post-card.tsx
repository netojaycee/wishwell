import Image from "next/image";
import type { PostRow } from "@/lib/types";
import { ReportButton } from "./report-button";

// Deterministic tiny rotation from the post id — "reads handmade" (DESIGN.md) without
// a client/server hydration mismatch (Math.random() would differ between the two).
function rotationFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ((hash % 5) - 2) * 0.6; // -1.2deg .. 1.2deg
}

export function PostCard({ post }: { post: PostRow }) {
  const rotation = rotationFor(post.id);
  const hasMedia = post.mediaType !== "none" && (post.mediaUrl || post.gifUrl);

  return (
    <article
      className="group relative break-inside-avoid rounded-2xl border shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
      style={{
        background: hasMedia ? "var(--board-surface)" : "var(--board-accent-soft)",
        borderColor: "color-mix(in srgb, var(--board-ink) 10%, transparent)",
        transform: `rotate(${rotation}deg)`,
      }}
    >
      {hasMedia ? (
        <div className="overflow-hidden rounded-t-2xl bg-black/5">
          {post.mediaType === "video" && post.mediaUrl ? (
            <video src={post.mediaUrl} controls className="w-full" />
          ) : post.mediaType === "gif" && post.gifUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- animated GIFs must not be re-encoded
            <img src={post.gifUrl} alt="" className="w-full" loading="lazy" />
          ) : post.mediaUrl ? (
            <Image
              src={post.mediaUrl}
              alt=""
              width={600}
              height={450}
              className="h-auto w-full object-cover"
            />
          ) : null}
        </div>
      ) : null}

      <div className={hasMedia ? "p-5" : "p-7"}>
        <p
          className={hasMedia ? "text-[15px] leading-relaxed" : "text-lg leading-relaxed"}
          style={{ color: "var(--board-ink)" }}
        >
          {post.body}
        </p>
        <p className="mt-4 text-sm font-medium" style={{ color: "var(--board-accent)" }}>
          — {post.authorName}
        </p>
      </div>
      <ReportButton postId={post.id} />
    </article>
  );
}
