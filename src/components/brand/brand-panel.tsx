// The warm dark "story" panel, tagline plus a celebratory and a solemn demo card side by
// side, shared by the auth split screen (desktop column AND mobile top band) and the
// About/Contact pages, so every one of those screens carries the same crafted feel at
// every width instead of degrading to a bare form on phones.
import Link from "next/link";
import { LogoMark } from "./logo-mark";
import { Reveal } from "@/components/board/reveal";
import { DemoCard } from "@/components/showcase/demo-card";
import { boardThemeVars } from "@/lib/theme/vars";
import { showcaseFor } from "@/lib/content/moments";
import type { FontPair, Palette } from "@/lib/theme/types";

// No DB access here, so the two panel themes are copied from the seed (birthday "Citrus
// Burst", memorial "Quiet Grey"), the "every occasion" pitch shown rather than claimed.
const BIRTHDAY_THEME: { palette: Palette; fontPair: FontPair } = {
  palette: { bg: "#FFF8EC", surface: "#FFFFFF", ink: "#2B1B0F", accent: "#FF7A3D", accentSoft: "#FFE1C4" },
  fontPair: { heading: "fraunces", body: "geist" },
};
const MEMORIAL_THEME: { palette: Palette; fontPair: FontPair } = {
  palette: { bg: "#F7F6F4", surface: "#FFFFFF", ink: "#1C1B19", accent: "#6B675E", accentSoft: "#E3E1DC" },
  fontPair: { heading: "instrument-serif", body: "geist" },
};

const GLOW =
  "radial-gradient(60% 50% at 20% 15%, rgba(196,113,63,0.5), transparent), radial-gradient(50% 45% at 85% 85%, rgba(242,228,188,0.18), transparent)";

type Variant = "column" | "band" | "card";

const LAYOUT: Record<
  Variant,
  { tagline: string; collage: string; cards: [string, string]; compact: boolean; sizes: string }
> = {
  // Desktop auth column.
  column: {
    tagline: "max-w-sm font-heading text-3xl leading-snug",
    collage: "relative mt-10 h-80 max-w-md",
    cards: ["absolute top-0 left-0 w-56", "absolute top-28 left-44 w-56"],
    compact: false,
    sizes: "224px",
  },
  // Mobile auth top band, kept short so the form still starts near the fold.
  band: {
    tagline: "mx-auto mt-6 max-w-[18rem] text-center font-heading text-[21px] leading-snug",
    collage: "relative mx-auto mt-6 h-44 w-full max-w-[300px]",
    cards: ["absolute top-0 left-0 w-[50%]", "absolute top-10 right-0 w-[50%]"],
    compact: true,
    sizes: "150px",
  },
  // About/Contact side card (inside the marketing header/footer chrome).
  card: {
    tagline: "max-w-sm font-heading text-2xl leading-snug sm:text-3xl",
    collage: "relative mt-8 h-64 w-full max-w-[380px] sm:h-72",
    cards: ["absolute top-0 left-0 w-[56%]", "absolute top-24 right-0 w-[54%]"],
    compact: false,
    sizes: "(min-width: 1024px) 220px, 55vw",
  },
};

export function BrandPanel({
  tagline,
  variant,
  className,
}: {
  tagline: string;
  variant: Variant;
  className?: string;
}) {
  const l = LAYOUT[variant];
  const cards = [
    { post: showcaseFor("birthday").posts[0], theme: BIRTHDAY_THEME, rotate: -5 },
    { post: showcaseFor("memorial").posts[1], theme: MEMORIAL_THEME, rotate: 4 },
  ];

  return (
    <div className={`relative overflow-hidden bg-[var(--brand-ink)] text-white ${className ?? ""}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: GLOW }} />
      {/* Gentle floating marks, decoration only, still under reduced motion. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="fh-float-slow absolute top-[18%] right-[10%] block">
          <LogoMark className="h-10 w-10 opacity-25" color="var(--brand-soft)" />
        </span>
        <span
          className="fh-float-slow absolute bottom-[22%] left-[8%] block h-3 w-3 rounded-full bg-[var(--brand)] opacity-60"
          style={{ animationDelay: "2s" }}
        />
        <span
          className="fh-float-slow absolute top-[42%] right-[30%] block h-2 w-2 rounded-full bg-[var(--brand-soft)] opacity-40"
          style={{ animationDelay: "3.5s" }}
        />
      </div>

      {variant !== "card" ? (
        <Link
          href="/"
          className={`relative flex items-center gap-2.5 font-heading text-white ${variant === "band" ? "text-lg" : "text-xl"}`}
        >
          <LogoMark className="h-6 w-6 shrink-0" color="var(--brand-soft)" />
          Fondly Held
        </Link>
      ) : null}

      <div className="relative">
        <p className={l.tagline}>{tagline}</p>

        <div className={l.collage}>
          {cards.map((card, i) => (
            <Reveal key={i} profile="warm" delay={0.2 + i * 0.15} className={l.cards[i]}>
              <div style={boardThemeVars(card.theme)}>
                <DemoCard post={card.post} rotate={card.rotate} sizes={l.sizes} compact={l.compact} className="shadow-2xl" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {variant !== "band" ? (
        <p className={`relative text-xs text-white/50 ${variant === "card" ? "mt-8" : ""}`}>
          Free while we&apos;re growing. Every feature, no account required to post.
        </p>
      ) : null}
    </div>
  );
}
