// Domain schema — one Board model, occasion is configuration (see ARCHITECTURE.md).
import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const motionProfileEnum = pgEnum("motion_profile", ["celebratory", "warm", "solemn"]);
export const boardModeEnum = pgEnum("board_mode", ["collaborative", "tribute"]);
export const boardVisibilityEnum = pgEnum("board_visibility", ["public", "unlisted", "private"]);
export const boardStatusEnum = pgEnum("board_status", ["draft", "collecting", "delivered", "archived"]);
export const postStatusEnum = pgEnum("post_status", ["published", "hidden", "pending"]);
export const mediaTypeEnum = pgEnum("media_type", ["none", "image", "video", "gif"]);

export const occasionType = pgTable("occasion_type", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), // e.g. "birthday" — used in /occasions/[key]
  label: text("label").notNull(),
  category: text("category").notNull(),
  motionProfile: motionProfileEnum("motion_profile").notNull(),
  promptText: text("prompt_text").notNull(),
  ctaText: text("cta_text").notNull(),
  seoTitle: text("seo_title").notNull(),
  seoDescription: text("seo_description").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const theme = pgTable("theme", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  // occasionTypeId is nullable: a theme with no occasion is a generic theme any board can pick.
  occasionTypeId: uuid("occasion_type_id").references(() => occasionType.id, { onDelete: "set null" }),
  isDefault: boolean("is_default").notNull().default(false),
  palette: jsonb("palette").$type<{ bg: string; surface: string; ink: string; accent: string; accentSoft: string }>().notNull(),
  backgroundUrl: text("background_url"),
  fontPair: jsonb("font_pair").$type<{ heading: string; body: string }>().notNull(),
  particleEffect: text("particle_effect"), // e.g. "confetti" | "balloons" | "grain" | null
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const board = pgTable("board", {
  id: uuid("id").primaryKey().defaultRandom(),
  // ownerId is nullable to support guest creation; claimToken lets a guest claim it after signing in.
  ownerId: text("owner_id").references(() => user.id, { onDelete: "set null" }),
  claimToken: text("claim_token").unique(),
  slug: text("slug").notNull().unique(),
  occasionTypeId: uuid("occasion_type_id").notNull().references(() => occasionType.id),
  mode: boardModeEnum("mode").notNull(),
  recipientName: text("recipient_name").notNull(),
  title: text("title").notNull(),
  headline: text("headline"),
  coverImageUrl: text("cover_image_url"),
  themeId: uuid("theme_id").notNull().references(() => theme.id),
  visibility: boardVisibilityEnum("visibility").notNull().default("public"),
  status: boardStatusEnum("status").notNull().default("collecting"),
  deliverAt: timestamp("deliver_at", { withTimezone: true }),
  closedAt: timestamp("closed_at", { withTimezone: true }),
  viewCount: integer("view_count").notNull().default(0),
  meta: jsonb("meta").$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const post = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => board.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  authorEmail: text("author_email"),
  body: text("body").notNull(),
  mediaUrl: text("media_url"),
  mediaType: mediaTypeEnum("media_type").notNull().default("none"),
  gifUrl: text("gif_url"),
  status: postStatusEnum("status").notNull().default("published"),
  pinned: boolean("pinned").notNull().default(false),
  // Hashed (not raw) requesting IP, used only for anonymous rate-limit windows.
  authorIpHash: text("author_ip_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const reaction = pgTable(
  "reaction",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    fingerprint: text("fingerprint").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("reaction_post_fingerprint_emoji").on(t.postId, t.fingerprint, t.emoji)]
);

export const invite = pgTable("invite", {
  id: uuid("id").primaryKey().defaultRandom(),
  boardId: uuid("board_id").notNull().references(() => board.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  token: text("token").notNull().unique(),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  openedAt: timestamp("opened_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const report = pgTable("report", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id").notNull().references(() => post.id, { onDelete: "cascade" }),
  reason: text("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const occasionTypeRelations = relations(occasionType, ({ many }) => ({
  themes: many(theme),
  boards: many(board),
}));

export const themeRelations = relations(theme, ({ one, many }) => ({
  occasionType: one(occasionType, { fields: [theme.occasionTypeId], references: [occasionType.id] }),
  boards: many(board),
}));

export const boardRelations = relations(board, ({ one, many }) => ({
  owner: one(user, { fields: [board.ownerId], references: [user.id] }),
  occasionType: one(occasionType, { fields: [board.occasionTypeId], references: [occasionType.id] }),
  theme: one(theme, { fields: [board.themeId], references: [theme.id] }),
  posts: many(post),
  invites: many(invite),
}));

export const postRelations = relations(post, ({ one, many }) => ({
  board: one(board, { fields: [post.boardId], references: [board.id] }),
  reactions: many(reaction),
  reports: many(report),
}));

export const reactionRelations = relations(reaction, ({ one }) => ({
  post: one(post, { fields: [reaction.postId], references: [post.id] }),
}));

export const inviteRelations = relations(invite, ({ one }) => ({
  board: one(board, { fields: [invite.boardId], references: [board.id] }),
}));

export const reportRelations = relations(report, ({ one }) => ({
  post: one(post, { fields: [report.postId], references: [post.id] }),
}));
