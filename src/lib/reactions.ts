// Reaction emoji per motion profile (tone follows occasion, CLAUDE.md rule 3): memorial
// and sympathy boards only ever offer quiet ones, never 🎉 or 😂.
export const REACTIONS = {
  celebratory: ["❤️", "🎉", "😂", "🥹"],
  warm: ["❤️", "🤗", "🙏", "😊"],
  solemn: ["🤍", "🙏", "🕊️"],
} as const;

export type ReactionCounts = Record<string, number>;
