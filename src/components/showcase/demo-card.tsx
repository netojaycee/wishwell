// A static, illustrative post card for marketing/showcase surfaces. Mirrors PostCard's
// look (photo-led; text-only cards get the soft accent surface and the heading font so
// they never look empty, DESIGN.md) but renders curated demo content from
// lib/content/moments.ts. Reads colours from `--board-*` vars set by an ancestor
// (boardThemeVars), exactly like the real board does.
import Image from "next/image";
import { GIFS, PHOTOS, type DemoPost } from "@/lib/content/moments";

export function DemoCard({
  post,
  rotate = 0,
  sizes = "(min-width: 1024px) 240px, 45vw",
  preload = false,
  compact = false,
  className,
}: {
  post: DemoPost;
  rotate?: number;
  sizes?: string;
  preload?: boolean;
  compact?: boolean;
  className?: string;
}) {
  const photo = post.photo ? PHOTOS[post.photo] : null;
  const gif = post.gif ? GIFS[post.gif] : null;
  const hasMedia = Boolean(photo || gif);

  return (
    <article
      className={`overflow-hidden rounded-2xl border shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12)] ${className ?? ""}`}
      style={{
        background: hasMedia ? "var(--board-surface)" : "var(--board-accent-soft)",
        borderColor: "color-mix(in srgb, var(--board-ink) 8%, transparent)",
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
    >
      {photo ? (
        <div className="relative aspect-[4/3] w-full">
          <Image src={photo.src} alt={photo.alt} fill sizes={sizes} preload={preload} className="object-cover" />
        </div>
      ) : null}
      {gif ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element -- animated GIFs must not be re-encoded */}
          <img src={gif.src} alt={gif.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <span className="absolute top-2 left-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-white">
            GIF
          </span>
        </div>
      ) : null}
      <div className={compact ? "p-3" : hasMedia ? "p-4" : "p-5"}>
        <p
          className={
            hasMedia
              ? compact
                ? "text-[12px] leading-snug"
                : "text-[13.5px] leading-relaxed"
              : compact
                ? "text-[14px] leading-snug"
                : "text-[17px] leading-snug"
          }
          style={{
            color: "var(--board-ink)",
            fontFamily: hasMedia ? undefined : "var(--board-font-heading)",
          }}
        >
          {post.body}
        </p>
        <p className={`${compact ? "mt-1.5 text-[11px]" : "mt-3 text-[13px]"} font-medium`} style={{ color: "var(--board-accent)" }}>
          {post.author}
        </p>
      </div>
    </article>
  );
}
