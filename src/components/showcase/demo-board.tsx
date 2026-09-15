// A miniature, fully themed board — browser-ish frame, hero, and a small masonry of demo
// cards — used wherever marketing needs to *show* the product rather than describe it
// (home page tone section, occasion landing pages). Pure presentation; entrance motion
// is the caller's job (wrap in Reveal with the right profile).
import { boardThemeVars } from "@/lib/theme/vars";
import type { Showcase } from "@/lib/content/moments";
import type { FontPair, Palette } from "@/lib/theme/types";
import { OccasionArt } from "@/components/illustrations/occasion-art";
import { DemoCard } from "./demo-card";

type Profile = "celebratory" | "warm" | "solemn";

export function DemoBoard({
  showcase,
  theme,
  occasionKey,
  occasionLabel,
  profile,
  tribute = false,
  className,
  preload = false,
}: {
  showcase: Showcase;
  theme: { palette: Palette; fontPair: FontPair };
  occasionKey: string;
  occasionLabel: string;
  profile: Profile;
  tribute?: boolean;
  className?: string;
  preload?: boolean;
}) {
  const [first, second, third] = showcase.posts;
  const count = showcase.posts.length + 14;

  return (
    <div
      className={`overflow-hidden rounded-[28px] border border-black/5 shadow-[0_2px_4px_rgba(0,0,0,0.04),0_24px_60px_-20px_rgba(0,0,0,0.25)] ${className ?? ""}`}
      style={{ ...boardThemeVars(theme), background: "var(--board-bg)", fontFamily: "var(--board-font-body)" }}
    >
      {/* Window chrome — reads instantly as "a web page you open from a link". */}
      <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: "color-mix(in srgb, var(--board-ink) 8%, transparent)" }}>
        <span className="flex gap-1.5" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-2 w-2 rounded-full" style={{ background: "color-mix(in srgb, var(--board-ink) 15%, transparent)" }} />
          ))}
        </span>
        <span
          className="mx-auto truncate rounded-full px-3 py-0.5 text-[10.5px]"
          style={{ background: "color-mix(in srgb, var(--board-ink) 5%, transparent)", color: "color-mix(in srgb, var(--board-ink) 55%, transparent)" }}
        >
          /b/{showcase.slug}
        </span>
      </div>

      <div className="relative px-4 pt-5 pb-4 text-center sm:px-5">
        {/* Celebratory boards get a scatter of static confetti dots; never on solemn. */}
        {profile === "celebratory" ? (
          <div aria-hidden className="pointer-events-none absolute inset-0">
            {[
              ["8%", "20%", 6, 0],
              ["88%", "16%", 5, 45],
              ["14%", "70%", 4, 20],
              ["84%", "64%", 6, 70],
              ["72%", "10%", 4, 10],
            ].map(([l, t, s, r], i) => (
              <span
                key={i}
                className="absolute rounded-[2px]"
                style={{
                  left: l as string,
                  top: t as string,
                  width: s as number,
                  height: (s as number) * 1.8,
                  transform: `rotate(${r}deg)`,
                  background: i % 2 ? "var(--board-accent)" : "var(--board-accent-soft)",
                }}
              />
            ))}
          </div>
        ) : null}

        <OccasionArt
          occasionKey={occasionKey}
          profile={profile}
          palette={theme.palette}
          className="relative mx-auto h-12 w-12"
        />
        <span
          className="relative mt-2 inline-flex rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold tracking-wider uppercase"
          style={{ background: "var(--board-accent-soft)", color: "var(--board-accent)" }}
        >
          {occasionLabel}
        </span>
        <p className="relative mt-2 text-xl leading-tight sm:text-2xl" style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}>
          {showcase.title}
        </p>
        <p className="relative mt-1 text-[11px]" style={{ color: "color-mix(in srgb, var(--board-ink) 55%, transparent)" }}>
          {count} {tribute ? "people have shared a memory" : "messages so far"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 px-3 pb-4 sm:gap-3 sm:px-4">
        <div className="space-y-2.5 sm:space-y-3">
          {first ? <DemoCard post={first} compact rotate={-1} preload={preload} sizes="(min-width: 1024px) 200px, 40vw" /> : null}
          {third ? <DemoCard post={third} compact rotate={0.8} /> : null}
        </div>
        <div className="space-y-2.5 pt-6 sm:space-y-3">
          {second ? <DemoCard post={second} compact rotate={1} sizes="(min-width: 1024px) 200px, 40vw" /> : null}
          <div
            className="flex h-16 items-center justify-center rounded-2xl border-2 border-dashed text-[11px] font-medium"
            style={{ borderColor: "color-mix(in srgb, var(--board-accent) 35%, transparent)", color: "var(--board-accent)" }}
          >
            + {tribute ? "Share a memory" : "Add yours"}
          </div>
        </div>
      </div>
    </div>
  );
}
