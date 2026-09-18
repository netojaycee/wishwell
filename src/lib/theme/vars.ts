// Maps a Theme row's palette/fontPair (DB data, unknown at Tailwind build time) to CSS
// custom properties. Board components read them via arbitrary-value classes, e.g.
// `bg-[var(--board-bg)]`, so nothing here needs to touch the static Tailwind theme.
import type { CSSProperties } from "react";
import type { FontPair, Palette, HeadingFont, BodyFont } from "./types";

type ThemeRow = { palette: Palette; fontPair: FontPair };

const HEADING_FONT_VAR: Record<HeadingFont, string> = {
  fraunces: "var(--font-fraunces)",
  "instrument-serif": "var(--font-instrument-serif)",
  playfair: "var(--font-playfair)",
};

const BODY_FONT_VAR: Record<BodyFont, string> = {
  geist: "var(--font-geist-sans)",
  inter: "var(--font-geist-sans)", // no Inter loaded yet, falls back cleanly
};

export function boardThemeVars(theme: ThemeRow): CSSProperties {
  return {
    "--board-bg": theme.palette.bg,
    "--board-surface": theme.palette.surface,
    "--board-ink": theme.palette.ink,
    "--board-accent": theme.palette.accent,
    "--board-accent-soft": theme.palette.accentSoft,
    "--board-font-heading": HEADING_FONT_VAR[theme.fontPair.heading],
    "--board-font-body": BODY_FONT_VAR[theme.fontPair.body],
  } as CSSProperties;
}
