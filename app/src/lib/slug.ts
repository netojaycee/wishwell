// Board slugs are the ad — pretty, shareable, and not enumerable (random suffix).
import { customAlphabet } from "nanoid";

const suffix = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

export function slugify(recipientName: string, occasionLabel?: string) {
  const base = `${recipientName}${occasionLabel ? ` ${occasionLabel}` : ""}`
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 40)
    .replace(/-$/, "");

  return `${base || "board"}-${suffix()}`;
}
