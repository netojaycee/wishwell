import Link from "next/link";
import { Reveal } from "./reveal";
import { OccasionArt, type ArtPalette } from "@/components/illustrations/occasion-art";

// Ghost cards hint at where the first messages will land — dashed, faint, theme-coloured.
const GHOSTS = [
  { h: "h-28", rotate: -1.5, offset: "" },
  { h: "h-36", rotate: 1, offset: "mt-6" },
  { h: "h-24", rotate: -0.8, offset: "mt-2" },
];

export function EmptyState({
  slug,
  mode,
  profile,
  occasionKey,
  palette,
}: {
  slug: string;
  mode: "collaborative" | "tribute";
  profile: "celebratory" | "warm" | "solemn";
  occasionKey: string;
  palette: ArtPalette;
}) {
  return (
    <Reveal profile={profile} inView>
      <div className="mx-auto max-w-xl px-6 pt-10 pb-20 text-center">
        <OccasionArt occasionKey={occasionKey} profile={profile} palette={palette} className="mx-auto mb-6 h-28 w-28" />
        <h2
          className="text-2xl"
          style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
        >
          {mode === "tribute" ? "Be the first to share a memory" : "Be the first to sign this board"}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[var(--board-ink)]/70">
          {mode === "tribute"
            ? "A memory, a photo, a few words — it means more than you know."
            : "Add a message, a photo, or a video. It takes a minute and it stays here forever."}
        </p>
        <Link
          href={`/b/${slug}/post`}
          className="mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--board-accent)" }}
        >
          {mode === "tribute" ? "Share a memory" : "Add your message"}
        </Link>

        <div aria-hidden className="mx-auto mt-12 grid max-w-md grid-cols-3 items-start gap-3 opacity-70">
          {GHOSTS.map((g, i) => (
            <div
              key={i}
              className={`${g.h} ${g.offset} rounded-2xl border-2 border-dashed p-3`}
              style={{
                borderColor: "color-mix(in srgb, var(--board-accent) 30%, transparent)",
                background: "color-mix(in srgb, var(--board-accent-soft) 40%, transparent)",
                transform: `rotate(${g.rotate}deg)`,
              }}
            >
              <div className="h-1.5 w-3/4 rounded-full" style={{ background: "color-mix(in srgb, var(--board-ink) 10%, transparent)" }} />
              <div className="mt-2 h-1.5 w-1/2 rounded-full" style={{ background: "color-mix(in srgb, var(--board-ink) 8%, transparent)" }} />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}
