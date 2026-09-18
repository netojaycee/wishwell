import Image from "next/image";
import type { PostRow } from "@/lib/types";
import { ReportButton } from "./report-button";

// Deterministic tiny rotation from the post id, "reads handmade" (DESIGN.md) without
// a client/server hydration mismatch (Math.random() would differ between the two).
function rotationFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ((hash % 5) - 2) * 0.6; // -1.2deg .. 1.2deg
}

// `onOpen` makes the photo and message open the lightbox; video controls, reactions
// (`footer`) and the report flag stay separate controls, never nested inside that button.
export function PostCard({
  post,
  onOpen,
  footer,
}: {
  post: PostRow;
  onOpen?: () => void;
  footer?: React.ReactNode;
}) {
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
          ) : (
            <OpenArea onOpen={onOpen} label={`Open ${post.authorName}'s photo`}>
              {post.mediaType === "gif" && post.gifUrl ? (
                // eslint-disable-next-line @next/next/no-img-element -- animated GIFs must not be re-encoded
                <img src={post.gifUrl} alt="" className="w-full" loading="lazy" />
              ) : post.mediaUrl ? (
                <Image src={post.mediaUrl} alt="" width={600} height={450} className="h-auto w-full object-cover" />
              ) : null}
            </OpenArea>
          )}
        </div>
      ) : null}

      <OpenArea onOpen={onOpen} label={`Open the message from ${post.authorName}`}>
        <div className={hasMedia ? "p-5" : "p-7"}>
          <p
            className={`line-clamp-[12] whitespace-pre-line ${hasMedia ? "text-[15px] leading-relaxed" : "text-lg leading-relaxed"}`}
            style={{ color: "var(--board-ink)" }}
          >
            {post.body}
          </p>
          <p className="mt-4 text-sm font-medium" style={{ color: "var(--board-accent)" }}>
            {post.authorName}
          </p>
        </div>
      </OpenArea>
      {footer ? <div className={hasMedia ? "px-5 pb-4" : "px-7 pb-5"}>{footer}</div> : null}
      <ReportButton postId={post.id} />
    </article>
  );
}

function OpenArea({ onOpen, label, children }: { onOpen?: () => void; label: string; children: React.ReactNode }) {
  if (!onOpen) return <>{children}</>;
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={label}
      className="block w-full cursor-zoom-in text-left focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--board-accent)]"
    >
      {children}
    </button>
  );
}
