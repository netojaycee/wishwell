import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Reveal } from "@/components/board/reveal";
import { DemoCard } from "@/components/showcase/demo-card";
import { boardThemeVars } from "@/lib/theme/vars";
import { showcaseFor } from "@/lib/content/moments";
import type { FontPair, Palette } from "@/lib/theme/types";

// No DB access here, so the two panel themes are copied from the seed (birthday "Citrus
// Burst", memorial "Quiet Grey") — a celebratory and a solemn card side by side, the
// "every occasion" pitch shown rather than claimed.
const BIRTHDAY_THEME: { palette: Palette; fontPair: FontPair } = {
  palette: { bg: "#FFF8EC", surface: "#FFFFFF", ink: "#2B1B0F", accent: "#FF7A3D", accentSoft: "#FFE1C4" },
  fontPair: { heading: "fraunces", body: "geist" },
};
const MEMORIAL_THEME: { palette: Palette; fontPair: FontPair } = {
  palette: { bg: "#F7F6F4", surface: "#FFFFFF", ink: "#1C1B19", accent: "#6B675E", accentSoft: "#E3E1DC" },
  fontPair: { heading: "instrument-serif", body: "geist" },
};

const PANEL_CARDS = [
  { post: showcaseFor("birthday").posts[0], theme: BIRTHDAY_THEME, rotate: -5, className: "absolute top-0 left-0 w-56" },
  { post: showcaseFor("memorial").posts[1], theme: MEMORIAL_THEME, rotate: 4, className: "absolute top-28 left-44 w-56" },
];

// Reused by sign-in/sign-up and by short, personal marketing pages (About, Contact) that
// want the same warm split-screen treatment instead of the full SiteHeader/SiteFooter
// marketing chrome. Long text pages (Privacy/Terms) intentionally stay single-column —
// a decorative panel next to a wall of legal text hurts readability rather than helping it.
export function SplitShell({
  children,
  tagline = "One link. Everyone contributes. Nothing to manage but the memory.",
  contentClassName = "max-w-sm",
}: {
  children: React.ReactNode;
  tagline?: string;
  contentClassName?: string;
}) {
  return (
    // grid-rows-[auto_1fr] below lg: without it the two mobile rows (header + form) split
    // the full height equally, so the one-line header ballooned to half the screen.
    <div className="grid min-h-full flex-1 grid-rows-[auto_1fr] lg:grid-cols-2 lg:grid-rows-none">
      {/* Mobile-only header — the desktop panel below (with the only logo) is hidden
          under lg, so without this, auth/about/contact pages had zero branding and no
          way back to the homepage on a phone. */}
      <div className="flex items-center border-b border-black/5 px-6 py-4 lg:hidden">
        <Link href="/" className="flex items-center gap-2 font-heading text-lg" style={{ color: "var(--brand-ink)" }}>
          <LogoMark className="h-5 w-5 shrink-0" color="var(--brand)" />
          Fondly Held
        </Link>
      </div>

      <div className="relative hidden overflow-hidden bg-[var(--brand-ink)] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 15%, rgba(196,113,63,0.5), transparent), radial-gradient(50% 45% at 85% 85%, rgba(242,228,188,0.18), transparent)",
          }}
        />
        {/* Gentle floating marks — decoration only, still under reduced motion. */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="fh-float-slow absolute top-[18%] right-[12%] block">
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

        <Link href="/" className="relative flex items-center gap-2.5 font-heading text-xl text-white">
          <LogoMark className="h-6 w-6 shrink-0" color="var(--brand-soft)" />
          Fondly Held
        </Link>

        <div className="relative">
          <p className="max-w-sm font-heading text-3xl leading-snug text-white">{tagline}</p>

          <div className="relative mt-10 h-80 max-w-md">
            {PANEL_CARDS.map((card, i) => (
              <Reveal key={i} profile="warm" delay={0.2 + i * 0.15} className={card.className}>
                <div style={boardThemeVars(card.theme)}>
                  <DemoCard post={card.post} rotate={card.rotate} sizes="224px" className="shadow-2xl" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/50">Free while we&apos;re growing. Every feature, no account required to post.</p>
      </div>

      <div className="flex items-center justify-center bg-[var(--background)] px-6 py-12 lg:py-16">
        <div className={`w-full ${contentClassName}`}>{children}</div>
      </div>
    </div>
  );
}
