// Shared shapes for Theme.palette / Theme.fontPair, used by the DB schema (jsonb
// columns), the seed script, and anything that renders a theme.
export type Palette = { bg: string; surface: string; ink: string; accent: string; accentSoft: string };
export type HeadingFont = "fraunces" | "instrument-serif" | "playfair";
export type BodyFont = "geist" | "inter";
export type FontPair = { heading: HeadingFont; body: BodyFont };
