import type { board, occasionType, post, theme } from "@/db/schema";

export type BoardRow = typeof board.$inferSelect;
export type ThemeRow = typeof theme.$inferSelect;
export type OccasionTypeRow = typeof occasionType.$inferSelect;
export type PostRow = typeof post.$inferSelect;

export type BoardWithRelations = BoardRow & {
  theme: ThemeRow;
  occasionType: OccasionTypeRow;
};
