import { and, desc, eq, ne, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "@/db";
import { board, invite, post } from "@/db/schema";
import { slugify } from "@/lib/slug";

export type NewBoard = {
  recipientName: string;
  title: string;
  headline: string | null;
  recipientBio: string | null;
  recipientPhotos: string[];
  themeId: string;
  mode: "collaborative" | "tribute";
  visibility: "public" | "unlisted" | "private";
};

export async function createBoard(input: NewBoard, occasionTypeId: string, occasionLabel: string, ownerId: string | null) {
  const slug = slugify(input.recipientName, occasionLabel);
  const claimToken = ownerId ? null : nanoid(24);

  const [row] = await db
    .insert(board)
    .values({
      ownerId,
      claimToken,
      slug,
      occasionTypeId,
      mode: input.mode,
      recipientName: input.recipientName,
      title: input.title,
      headline: input.headline,
      recipientBio: input.recipientBio,
      recipientPhotos: input.recipientPhotos,
      themeId: input.themeId,
      visibility: input.visibility,
      status: "collecting",
    })
    .returning();

  return row;
}

export async function getBoardBySlug(slug: string) {
  return db.query.board.findFirst({
    where: eq(board.slug, slug),
    with: { theme: true, occasionType: true },
  });
}

export async function getBoardById(id: string) {
  const [row] = await db.select().from(board).where(eq(board.id, id));
  return row ?? null;
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

export async function listRecentPublicBoardsForOccasion(occasionTypeId: string, limit = 3) {
  return db
    .select()
    .from(board)
    .where(and(eq(board.occasionTypeId, occasionTypeId), eq(board.visibility, "public")))
    .orderBy(desc(board.createdAt))
    .limit(limit);
}

export async function updateBoardDetails(
  boardId: string,
  ownerId: string,
  input: {
    recipientName?: string;
    title?: string;
    headline?: string | null;
    recipientBio?: string | null;
    recipientPhotos?: string[];
    visibility?: "public" | "unlisted" | "private";
  }
) {
  const [row] = await db
    .update(board)
    .set({ ...input, updatedAt: new Date() })
    .where(and(eq(board.id, boardId), eq(board.ownerId, ownerId)))
    .returning();
  return row ?? null;
}

// Permanently deletes a board and everything on it, including every file in R2
// (CLAUDE.md: media deletion must actually delete from object storage). Posts, invites,
// reactions and reports go with the row via ON DELETE CASCADE.
export async function deleteBoardWithMedia(boardId: string, ownerId: string) {
  const [target] = await db
    .select({ id: board.id, slug: board.slug, cover: board.coverImageUrl, photos: board.recipientPhotos })
    .from(board)
    .where(and(eq(board.id, boardId), eq(board.ownerId, ownerId)));
  if (!target) return null;

  const media = await db.select({ url: post.mediaUrl }).from(post).where(eq(post.boardId, boardId));
  const urls = [target.cover, ...target.photos, ...media.map((m) => m.url)].filter((u): u is string => Boolean(u));

  await db.delete(board).where(eq(board.id, boardId));
  // After the row is gone: a storage hiccup must not leave a half-deleted board. Anything
  // missed here is unreferenced now, so the daily orphan sweep catches it.
  const { deleteMedia } = await import("@/lib/media");
  await Promise.all(urls.map((u) => deleteMedia(u).catch(() => undefined)));
  return target;
}

export async function deleteAllBoardsForOwner(ownerId: string) {
  const owned = await db.select({ id: board.id }).from(board).where(eq(board.ownerId, ownerId));
  for (const b of owned) await deleteBoardWithMedia(b.id, ownerId);
  return owned.length;
}

// Collaborative boards only: schedule when posting closes, deliver now, or reopen.
export async function setBoardDelivery(
  boardId: string,
  ownerId: string,
  change: { deliverAt?: Date | null; status?: "collecting" | "delivered"; closedAt?: Date | null }
) {
  const [row] = await db
    .update(board)
    .set({ ...change, updatedAt: new Date() })
    .where(and(eq(board.id, boardId), eq(board.ownerId, ownerId), eq(board.mode, "collaborative")))
    .returning();
  return row ?? null;
}

// Boards someone else made that this user was invited to (matched on a VERIFIED email only,
// otherwise anyone could sign up with a stranger's address and read their invites). The
// link carries the invite token so private boards open on any device.
export async function listInvitedBoards(userId: string, email: string, emailVerified: boolean) {
  if (!emailVerified) return [];
  const rows = await db
    .select({ boardId: invite.boardId, token: invite.token })
    .from(invite)
    .innerJoin(board, eq(invite.boardId, board.id))
    .where(and(sql`lower(${invite.email}) = ${email.toLowerCase()}`, ne(board.ownerId, userId)))
    .orderBy(desc(invite.createdAt));
  const tokenByBoard = new Map<string, string>();
  for (const r of rows) if (!tokenByBoard.has(r.boardId)) tokenByBoard.set(r.boardId, r.token);
  if (tokenByBoard.size === 0) return [];

  const boards = await db.query.board.findMany({
    where: (b, { inArray }) => inArray(b.id, [...tokenByBoard.keys()]),
    with: { theme: true, occasionType: true },
  });
  return boards.map((b) => ({ ...b, href: `/b/${b.slug}?invite=${tokenByBoard.get(b.id)}` }));
}

// Boards this user has written on (not their own, not private: a private board's link only
// works with an invite, which listInvitedBoards already covers).
export async function listContributedBoards(userId: string) {
  const ids = await db
    .selectDistinct({ boardId: post.boardId })
    .from(post)
    .innerJoin(board, eq(post.boardId, board.id))
    .where(and(eq(post.userId, userId), ne(board.visibility, "private"), sql`${board.ownerId} is distinct from ${userId}`));
  if (ids.length === 0) return [];
  const boards = await db.query.board.findMany({
    where: (b, { inArray }) => inArray(b.id, ids.map((i) => i.boardId)),
    with: { theme: true, occasionType: true },
    orderBy: desc(board.createdAt),
  });
  return boards.map((b) => ({ ...b, href: `/b/${b.slug}` }));
}
