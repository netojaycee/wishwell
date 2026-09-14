import { and, desc, eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { board, post } from "@/db/schema";
import { slugify } from "@/lib/slug";
import type { CreateBoardInput } from "@/lib/validation/board";

export async function createBoard(input: CreateBoardInput, occasionLabel: string, ownerId: string | null) {
  const slug = slugify(input.recipientName, occasionLabel);
  const claimToken = ownerId ? null : nanoid(24);

  const [row] = await db
    .insert(board)
    .values({
      ownerId,
      claimToken,
      slug,
      occasionTypeId: (await getOccasionTypeId(input.occasionKey))!,
      mode: input.mode,
      recipientName: input.recipientName,
      title: input.title,
      headline: input.headline,
      themeId: input.themeId,
      visibility: input.visibility,
      status: "collecting",
    })
    .returning();

  return row;
}

async function getOccasionTypeId(occasionKey: string) {
  const { getOccasionByKey } = await import("@/lib/data/occasions");
  const occasion = await getOccasionByKey(occasionKey);
  return occasion?.id ?? null;
}

export async function getBoardBySlug(slug: string) {
  return db.query.board.findFirst({
    where: eq(board.slug, slug),
    with: { theme: true, occasionType: true },
  });
}

export async function getBoardByClaimToken(claimToken: string) {
  const [row] = await db.select().from(board).where(eq(board.claimToken, claimToken));
  return row ?? null;
}

export async function claimBoard(claimToken: string, ownerId: string) {
  const [row] = await db
    .update(board)
    .set({ ownerId, claimToken: null, updatedAt: new Date() })
    .where(eq(board.claimToken, claimToken))
    .returning();
  return row ?? null;
}

export async function incrementBoardView(boardId: string) {
  await db
    .update(board)
    .set({ viewCount: sql`${board.viewCount} + 1` })
    .where(eq(board.id, boardId));
}

export async function listBoardsForOwner(ownerId: string) {
  const rows = await db.query.board.findMany({
    where: eq(board.ownerId, ownerId),
    with: { theme: true, occasionType: true },
    orderBy: desc(board.createdAt),
  });

  const counts = await db
    .select({ boardId: post.boardId, count: sql<number>`count(*)::int` })
    .from(post)
    .where(eq(post.status, "published"))
    .groupBy(post.boardId);

  const countByBoard = new Map(counts.map((c) => [c.boardId, c.count]));

  return rows.map((r) => ({ ...r, postCount: countByBoard.get(r.id) ?? 0 }));
}

export async function updateBoardTheme(boardId: string, ownerId: string, themeId: string) {
  const [row] = await db
    .update(board)
    .set({ themeId, updatedAt: new Date() })
    .where(and(eq(board.id, boardId), eq(board.ownerId, ownerId)))
    .returning();
  return row ?? null;
}

export async function updateBoardDetails(
  boardId: string,
  ownerId: string,
  input: { title?: string; headline?: string; visibility?: "public" | "unlisted" | "private" }
) {
  const [row] = await db
    .update(board)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(board.id, boardId), eq(board.ownerId, ownerId)))
    .returning();
  return row ?? null;
}
