// Home hero's product collage: real demo cards (photo, GIF, text, memorial photo) each in
// its own occasion theme, so "every occasion" is shown rather than claimed. Desktop gets
// the full spread with stickers and a "just posted" toast; mobile gets a compact stack.
import type { CSSProperties, ReactNode } from "react";
import { boardThemeVars } from "@/lib/theme/vars";
import { showcaseFor } from "@/lib/content/moments";
import type { ThemeRow } from "@/lib/types";
import { Reveal } from "@/components/board/reveal";
import { DemoCard } from "@/components/showcase/demo-card";

// Same `sizes` on both variants so the preloaded LCP candidate is the one actually used.
const LCP_SIZES = "(min-width: 1024px) 232px, 52vw";

function Themed({ theme, className, style, children }: { theme?: ThemeRow; className?: string; style?: CSSProperties; children: ReactNode }) {
  if (!theme) return null;
  return (
    <div className={className} style={{ ...boardThemeVars(theme), ...style }}>
      {children}
    </div>
  );
}

function Sticker({ kind, className, delay = 0 }: { kind: "heart" | "sparkle"; className: string; delay?: number }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden className={`fh-float ${className}`} style={{ animationDelay: `${delay}s` }}>
      {kind === "heart" ? (
        <path
          d="M20 33C8 25 4 18 7 12c3-5 9-5 13 0c4-5 10-5 13 0c3 6-1 13-13 21Z"
          fill="var(--brand)"
          stroke="var(--brand-ink)"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      ) : (
        <path d="M20 3Q20 20 37 20Q20 20 20 37Q20 20 3 20Q20 20 20 3Z" fill="var(--brand-soft)" stroke="var(--brand-ink)" strokeWidth="2" strokeLinejoin="round" />
      )}
    </svg>
  );
}

export function HeroCollage({ variant, themes }: { variant: "desktop" | "mobile"; themes: Record<string, ThemeRow | undefined> }) {
  const birthday = showcaseFor("birthday").posts;
  const farewell = showcaseFor("farewell").posts;
  const memorial = showcaseFor("memorial").posts;

  if (variant === "mobile") {
    return (
      <div className="relative mx-auto mt-12 h-[340px] w-full max-w-[360px] lg:hidden" aria-hidden>
        <Themed theme={themes.birthday} className="absolute top-0 left-0 w-[54%]">
          <Reveal profile="warm" delay={0.2}>
            <DemoCard post={birthday[0]} rotate={-4} sizes={LCP_SIZES} />
          </Reveal>
        </Themed>
        <Themed theme={themes.birthday} className="absolute top-8 right-0 w-[46%]">
          <Reveal profile="celebratory" delay={0.3}>
            <DemoCard post={birthday[1]} rotate={5} compact />
          </Reveal>
        </Themed>
        <Themed theme={themes.farewell} className="absolute bottom-0 left-[16%] w-[66%]">
          <Reveal profile="warm" delay={0.4}>
            <DemoCard post={farewell[2]} rotate={-1.5} compact />
          </Reveal>
        </Themed>
        <Sticker kind="sparkle" className="absolute -top-4 left-[46%] h-7 w-7" />
      </div>
    );
  }

  return (
    <div className="relative hidden h-[540px] w-[450px] shrink-0 lg:block" aria-hidden>
      <Themed theme={themes.birthday} className="absolute top-10 left-0 w-[232px]">
        <Reveal profile="warm" delay={0.15}>
          <DemoCard post={birthday[0]} rotate={-5} preload sizes={LCP_SIZES} />
        </Reveal>
      </Themed>

      <Themed theme={themes.birthday} className="absolute top-0 right-3 w-[196px]">
        <Reveal profile="celebratory" delay={0.25}>
          <DemoCard post={birthday[1]} rotate={5} />
        </Reveal>
      </Themed>

      <Themed theme={themes.farewell} className="absolute bottom-6 left-5 w-[236px]">
        <Reveal profile="warm" delay={0.35}>
          <DemoCard post={farewell[2]} rotate={-2} />
        </Reveal>
      </Themed>

      {/* Memorial card sits apart from the stickers and toast — nothing playful near it. */}
      <Themed theme={themes.memorial} className="absolute right-0 bottom-0 w-[210px]">
        <Reveal profile="solemn" delay={0.45}>
          <DemoCard post={memorial[0]} rotate={2.5} />
        </Reveal>
      </Themed>

      {/* "Someone just posted" — loops in, holds, leaves. Static under reduced motion. */}
      <Themed theme={themes.birthday} className="absolute -bottom-10 left-10 z-10">
        <div className="fh-toast flex items-center gap-2 rounded-full border border-black/5 bg-white/95 py-1.5 pr-3.5 pl-1.5 text-xs shadow-lg backdrop-blur">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{ background: "var(--board-accent)" }}
          >
            K
          </span>
          <span className="text-black/75">
            <span className="font-semibold text-black/85">Kemi</span> just added a GIF
          </span>
          <span className="text-black/35">now</span>
        </div>
      </Themed>

      <Sticker kind="heart" className="absolute top-0 left-[40%] h-9 w-9" delay={0.4} />
      <Sticker kind="sparkle" className="absolute top-2 -left-5 h-7 w-7" delay={1.3} />
    </div>
  );
}
