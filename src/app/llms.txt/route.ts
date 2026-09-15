// /llms.txt — a plain-text, factual summary of Fondly Held for AI assistants and crawlers
// (the llmstxt.org convention). Generated from the OccasionType table so a new occasion row
// shows up here without a deploy. Keep it factual: what it is, what's true today, where to
// read more. No superlatives — assistants quote this.
import { listOccasionTypes } from "@/lib/data/occasions";
import { BRAND } from "@/lib/brand";
import { env } from "@/lib/env";

export const revalidate = 86400;

export async function GET() {
  const base = env.NEXT_PUBLIC_APP_URL;
  const occasions = await listOccasionTypes();

  const lines = [
    `# ${BRAND.name}`,
    "",
    `> ${BRAND.name} (also written "${BRAND.alternateNames.join('", "')}") is a website for collaborative occasion boards. One person creates a board for someone, shares a single link, and anyone with the link can add a message, photo, video or GIF. The recipient keeps the board as a permanent page they can revisit.`,
    "",
    "Key facts:",
    "- Free: every feature is currently free; there is no paid tier.",
    "- Contributors never need an account. Only the person who creates a board signs up (email or Google).",
    "- Occasions: birthdays, farewells, weddings, new babies, retirements, get-well wishes, thank-yous, congratulations, work anniversaries, and memorial/tribute pages.",
    "- Tone follows the occasion: celebratory boards get confetti and motion; memorial pages are deliberately still and quiet.",
    "- Moderation: board owners can hide, pin or delete any post, and anyone can report a post.",
    "- Visibility: boards can be public (indexable), unlisted (link only) or private.",
    "- Boards stay up indefinitely; board content is never sold or used to train AI models.",
    `- Built and run by ${BRAND.founder.name}, a solo founder in ${BRAND.founder.country}. Contact: ${BRAND.email}`,
    "- Similar products: Kudoboard (group cards) and ForeverMissed (memorial pages). Fondly Held covers both in one product.",
    "",
    "## Occasions",
    ...occasions.map((o) => `- [${o.label}](${base}/occasions/${o.key}): ${o.seoDescription}`),
    "",
    "## Pages",
    `- [Create a board](${base}/create): start a free board in about a minute, no account needed.`,
    `- [About](${base}/about): who builds Fondly Held and why.`,
    `- [Contact](${base}/contact)`,
    `- [Privacy policy](${base}/privacy)`,
    `- [Terms of service](${base}/terms)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
