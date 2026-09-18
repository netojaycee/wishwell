// Seeds the 10 Day-1 occasion types + 3 themes each (BUILD_PLAN.md Hour 1–2).
// Idempotent: safe to re-run, upserts by natural key (occasion `key`, theme `name`).
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

import type { Palette, FontPair } from "@/lib/theme/types";

type OccasionSeed = {
  key: string;
  label: string;
  category: string;
  motionProfile: "celebratory" | "warm" | "solemn";
  promptText: string;
  ctaText: string;
  seoTitle: string;
  seoDescription: string;
  themes: { name: string; palette: Palette; fontPair: FontPair; particleEffect: string | null; isDefault?: boolean }[];
};

const occasions: OccasionSeed[] = [
  {
    key: "birthday",
    label: "Birthday",
    category: "celebration",
    motionProfile: "celebratory",
    promptText: "Share a birthday memory or wish",
    ctaText: "Start their birthday board",
    seoTitle: "Free Online Birthday Cards, Group Birthday Board | Fondly Held",
    seoDescription:
      "Create a free group birthday card in seconds. Invite friends and family to add messages, photos and videos to one beautiful page, no signup required to post.",
    themes: [
      {
        name: "Citrus Burst",
        palette: { bg: "#FFF8EC", surface: "#FFFFFF", ink: "#2B1B0F", accent: "#FF7A3D", accentSoft: "#FFE1C4" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "confetti",
        isDefault: true,
      },
      {
        name: "Berry Pop",
        palette: { bg: "#FFF3F6", surface: "#FFFFFF", ink: "#2B0F1B", accent: "#E63E6D", accentSoft: "#FBD0DE" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: "confetti",
      },
      {
        name: "Sky Party",
        palette: { bg: "#F1FAFF", surface: "#FFFFFF", ink: "#0F1F2B", accent: "#2B9FE6", accentSoft: "#CDEBFB" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "balloons",
      },
    ],
  },
  {
    key: "congratulations",
    label: "Congratulations",
    category: "celebration",
    motionProfile: "celebratory",
    promptText: "Say congratulations",
    ctaText: "Start a congratulations board",
    seoTitle: "Free Online Congratulations Cards, Group Card | Fondly Held",
    seoDescription:
      "Celebrate a graduation, promotion or big win with a group congratulations card. Everyone adds a message or photo to one link, free, no signup to post.",
    themes: [
      {
        name: "Gold Foil",
        palette: { bg: "#FFFBF0", surface: "#FFFFFF", ink: "#241C0A", accent: "#C9971F", accentSoft: "#F2E4BC" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "confetti",
        isDefault: true,
      },
      {
        name: "Emerald Win",
        palette: { bg: "#F1FBF6", surface: "#FFFFFF", ink: "#0B241A", accent: "#1E9E63", accentSoft: "#C9EEDB" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: "confetti",
      },
      {
        name: "Violet Cheer",
        palette: { bg: "#F8F3FF", surface: "#FFFFFF", ink: "#1D0B24", accent: "#8A3FE6", accentSoft: "#E3D2FB" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "confetti",
      },
    ],
  },
  {
    key: "wedding",
    label: "Wedding",
    category: "celebration",
    motionProfile: "celebratory",
    promptText: "Share your wishes for the happy couple",
    ctaText: "Start a wedding guestbook",
    seoTitle: "Free Online Wedding Guestbook Cards | Fondly Held",
    seoDescription:
      "A digital wedding guestbook guests can sign from anywhere. Collect messages, photos and videos on one beautiful page and keep it forever.",
    themes: [
      {
        name: "Blush Bouquet",
        palette: { bg: "#FFF6F5", surface: "#FFFFFF", ink: "#2A1414", accent: "#D97C74", accentSoft: "#F6D9D5" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: "confetti",
        isDefault: true,
      },
      {
        name: "Sage & Ivory",
        palette: { bg: "#F7FAF5", surface: "#FFFFFF", ink: "#16201A", accent: "#6E8F63", accentSoft: "#DCE8D6" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: "confetti",
      },
      {
        name: "Champagne Gold",
        palette: { bg: "#FFFAF0", surface: "#FFFFFF", ink: "#241E10", accent: "#B98B3E", accentSoft: "#EEDFBE" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: "confetti",
      },
    ],
  },
  {
    key: "new-baby",
    label: "New Baby",
    category: "celebration",
    motionProfile: "celebratory",
    promptText: "Welcome the new arrival",
    ctaText: "Start a new baby board",
    seoTitle: "Free Online New Baby Cards, Group Card | Fondly Held",
    seoDescription:
      "Welcome a new baby with a group card everyone can sign online. Collect messages, photos and well-wishes on one page, free, no signup required to post.",
    themes: [
      {
        name: "Soft Clouds",
        palette: { bg: "#F4F9FF", surface: "#FFFFFF", ink: "#101B2A", accent: "#5AA9E6", accentSoft: "#D7EBFB" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "balloons",
        isDefault: true,
      },
      {
        name: "Peach Nursery",
        palette: { bg: "#FFF7F2", surface: "#FFFFFF", ink: "#2A1B10", accent: "#E69256", accentSoft: "#F8DFC8" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "balloons",
      },
      {
        name: "Mint Wonder",
        palette: { bg: "#F2FBF8", surface: "#FFFFFF", ink: "#0F2420", accent: "#3FB893", accentSoft: "#CDF0E4" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: "confetti",
      },
    ],
  },
  {
    key: "work-anniversary",
    label: "Work Anniversary",
    category: "celebration",
    motionProfile: "celebratory",
    promptText: "Celebrate a work milestone",
    ctaText: "Start a work anniversary board",
    seoTitle: "Free Online Work Anniversary Cards for Teams | Fondly Held",
    seoDescription:
      "Celebrate a coworker's work anniversary with a group card the whole team can sign. Free, beautiful, and no signup required for teammates to post.",
    themes: [
      {
        name: "Navy Milestone",
        palette: { bg: "#F3F6FB", surface: "#FFFFFF", ink: "#0E1A2E", accent: "#2C4E8A", accentSoft: "#D2DCEE" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "confetti",
        isDefault: true,
      },
      {
        name: "Amber Achievement",
        palette: { bg: "#FFFAF1", surface: "#FFFFFF", ink: "#241C0E", accent: "#D68A22", accentSoft: "#F3DFB8" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: "confetti",
      },
      {
        name: "Slate Celebration",
        palette: { bg: "#F5F6F7", surface: "#FFFFFF", ink: "#191C1F", accent: "#4C6570", accentSoft: "#D9E0E2" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: "confetti",
      },
    ],
  },
  {
    key: "farewell",
    label: "Farewell",
    category: "transition",
    motionProfile: "warm",
    promptText: "Share a farewell message",
    ctaText: "Start a farewell board",
    seoTitle: "Free Online Farewell Cards for Coworkers | Fondly Held",
    seoDescription:
      "Send a coworker off with a group farewell card. Everyone adds a message, photo or memory to one page, free, no signup required to contribute.",
    themes: [
      {
        name: "Warm Horizon",
        palette: { bg: "#FDF6EF", surface: "#FFFFFF", ink: "#241C14", accent: "#C4713F", accentSoft: "#EEDAC5" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: null,
        isDefault: true,
      },
      {
        name: "Dusty Rose",
        palette: { bg: "#FBF3F2", surface: "#FFFFFF", ink: "#241716", accent: "#B76C68", accentSoft: "#EBD8D6" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: null,
      },
      {
        name: "Harbor Blue",
        palette: { bg: "#F3F7FA", surface: "#FFFFFF", ink: "#141F26", accent: "#4E7E92", accentSoft: "#D6E5EA" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: null,
      },
    ],
  },
  {
    key: "retirement",
    label: "Retirement",
    category: "transition",
    motionProfile: "warm",
    promptText: "Share a retirement wish or memory",
    ctaText: "Start a retirement board",
    seoTitle: "Free Online Retirement Cards for Coworkers | Fondly Held",
    seoDescription:
      "Celebrate a well-earned retirement with a group card. Collect messages, memories and photos from coworkers and friends on one lasting page.",
    themes: [
      {
        name: "Golden Hour",
        palette: { bg: "#FDF7EC", surface: "#FFFFFF", ink: "#26200F", accent: "#C99A38", accentSoft: "#EFE1BE" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: null,
        isDefault: true,
      },
      {
        name: "Evergreen",
        palette: { bg: "#F4F8F3", surface: "#FFFFFF", ink: "#162016", accent: "#4C7A4A", accentSoft: "#D6E6D5" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: null,
      },
      {
        name: "Quiet Tide",
        palette: { bg: "#F2F7F8", surface: "#FFFFFF", ink: "#101E20", accent: "#3E848F", accentSoft: "#D2E6E8" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: null,
      },
    ],
  },
  {
    key: "get-well",
    label: "Get Well Soon",
    category: "support",
    motionProfile: "warm",
    promptText: "Send get-well wishes",
    ctaText: "Start a get-well board",
    seoTitle: "Free Online Get Well Soon Cards, Group Card | Fondly Held",
    seoDescription:
      "Send comfort and encouragement with a group get-well-soon card. Friends and family add messages and photos to one page, free, gentle, no signup to post.",
    themes: [
      {
        name: "Gentle Bloom",
        palette: { bg: "#FBF5F7", surface: "#FFFFFF", ink: "#221A1D", accent: "#B4708A", accentSoft: "#EBD7DE" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: null,
        isDefault: true,
      },
      {
        name: "Soft Sage",
        palette: { bg: "#F5F8F4", surface: "#FFFFFF", ink: "#182018", accent: "#6E8F63", accentSoft: "#DDE8D9" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: null,
      },
      {
        name: "Calm Sky",
        palette: { bg: "#F2F7FB", surface: "#FFFFFF", ink: "#131E26", accent: "#5B87A6", accentSoft: "#D6E5EE" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: null,
      },
    ],
  },
  {
    key: "thank-you",
    label: "Thank You",
    category: "gratitude",
    motionProfile: "warm",
    promptText: "Say thank you",
    ctaText: "Start a thank-you board",
    seoTitle: "Free Online Thank You Cards, Group Card | Fondly Held",
    seoDescription:
      "Show appreciation with a group thank-you card. Everyone adds a message or photo to one beautiful page, free, no signup required to contribute.",
    themes: [
      {
        name: "Honeyed Cream",
        palette: { bg: "#FDF8EE", surface: "#FFFFFF", ink: "#241E10", accent: "#C79A3E", accentSoft: "#F0E3BE" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: null,
        isDefault: true,
      },
      {
        name: "Terracotta Warmth",
        palette: { bg: "#FCF3EE", surface: "#FFFFFF", ink: "#26160E", accent: "#C56B41", accentSoft: "#F0D9C9" },
        fontPair: { heading: "playfair", body: "geist" },
        particleEffect: null,
      },
      {
        name: "Soft Denim",
        palette: { bg: "#F3F6FA", surface: "#FFFFFF", ink: "#121A24", accent: "#4E6C93", accentSoft: "#D6DFEB" },
        fontPair: { heading: "fraunces", body: "geist" },
        particleEffect: null,
      },
    ],
  },
  {
    key: "memorial",
    label: "Memorial",
    category: "tribute",
    motionProfile: "solemn",
    promptText: "Share a memory",
    ctaText: "Start a memorial page",
    seoTitle: "Free Online Memorial Pages & Tribute Cards | Fondly Held",
    seoDescription:
      "Create a lasting online memorial page to honor someone's memory. Family and friends can share memories, photos and condolences on one page, kept forever, free.",
    themes: [
      {
        name: "Quiet Grey",
        palette: { bg: "#F7F6F4", surface: "#FFFFFF", ink: "#1C1B19", accent: "#6B675E", accentSoft: "#E3E1DC" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: "grain",
        isDefault: true,
      },
      {
        name: "Candlelight",
        palette: { bg: "#F8F5F0", surface: "#FFFFFF", ink: "#201C15", accent: "#8A6E3E", accentSoft: "#E8E0CE" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: "grain",
      },
      {
        name: "Still Water",
        palette: { bg: "#F5F7F7", surface: "#FFFFFF", ink: "#171E1E", accent: "#5A7778", accentSoft: "#DCE5E5" },
        fontPair: { heading: "instrument-serif", body: "geist" },
        particleEffect: "grain",
      },
    ],
  },
];

async function main() {
  // Dynamic imports: loaded only after dotenv config() above has run, since
  // src/lib/env.ts (pulled in via ./index) reads process.env at import time.
  const { db } = await import("./index");
  const { occasionType, theme } = await import("./schema");
  const { eq } = await import("drizzle-orm");

  console.log(`Seeding ${occasions.length} occasion types…`);

  for (const o of occasions) {
    const [existing] = await db.select().from(occasionType).where(eq(occasionType.key, o.key));

    const [row] = existing
      ? await db
          .update(occasionType)
          .set({
            label: o.label,
            category: o.category,
            motionProfile: o.motionProfile,
            promptText: o.promptText,
            ctaText: o.ctaText,
            seoTitle: o.seoTitle,
            seoDescription: o.seoDescription,
          })
          .where(eq(occasionType.key, o.key))
          .returning()
      : await db
          .insert(occasionType)
          .values({
            key: o.key,
            label: o.label,
            category: o.category,
            motionProfile: o.motionProfile,
            promptText: o.promptText,
            ctaText: o.ctaText,
            seoTitle: o.seoTitle,
            seoDescription: o.seoDescription,
          })
          .returning();

    for (const t of o.themes) {
      const [existingTheme] = await db
        .select()
        .from(theme)
        .where(eq(theme.name, t.name));

      if (existingTheme) {
        await db
          .update(theme)
          .set({
            occasionTypeId: row.id,
            isDefault: t.isDefault ?? false,
            palette: t.palette,
            fontPair: t.fontPair,
            particleEffect: t.particleEffect,
          })
          .where(eq(theme.id, existingTheme.id));
      } else {
        await db.insert(theme).values({
          name: t.name,
          occasionTypeId: row.id,
          isDefault: t.isDefault ?? false,
          palette: t.palette,
          fontPair: t.fontPair,
          particleEffect: t.particleEffect,
        });
      }
    }

    console.log(`  ✓ ${o.label} (${o.themes.length} themes)`);
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
