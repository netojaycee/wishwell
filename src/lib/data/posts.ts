import { and, asc, desc, eq, gte, inArray, isNull, sql } from "drizzle-orm";
import { db } from "@/db";
import { board, occasionType, post, reaction, report } from "@/db/schema";
import { deleteMedia } from "@/lib/media";
import type { CreatePostInput } from "@/lib/validation/post";

export async function createPost(boardId: string, input: Omit<CreatePostInput, "website" | "renderedAt">, ipHash: string, userId: string | null = null) {
  const [row] = await db
    .insert(post)
    .values({
      boardId,
      authorName: input.authorName,
      body: input.body,
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      gifUrl: input.gifUrl,
      authorIpHash: ipHash,
      userId,
      status: "published",
    })
    .returning();

  return row;
}

export async function listPublishedPosts(boardId: string) {
  return db
    .select()
    .from(post)
    .where(and(eq(post.boardId, boardId), eq(post.status, "published")))
    .orderBy(desc(post.pinned), desc(post.createdAt));
}

// Owner moderation view: everything, including hidden/pending. Each post carries every
// reason it was reported for, and reported posts are listed first, then oldest first.
export async function listAllPostsForModeration(boardId: string) {
  const [rows, reports] = await Promise.all([
    db.select().from(post).where(eq(post.boardId, boardId)).orderBy(asc(post.createdAt)),
    db
      .select({ postId: report.postId, reason: report.reason })
      .from(report)
      .innerJoin(post, eq(report.postId, post.id))
      .where(eq(post.boardId, boardId))
      .orderBy(asc(report.createdAt)),
  ]);

  const reasonsByPost = new Map<string, string[]>();
  for (const r of reports) reasonsByPost.set(r.postId, [...(reasonsByPost.get(r.postId) ?? []), r.reason]);

  const withReports = rows.map((p) => ({ ...p, reports: reasonsByPost.get(p.id) ?? [] }));
  return [...withReports.filter((p) => p.reports.length > 0), ...withReports.filter((p) => p.reports.length === 0)];
}

export async function countPublishedPosts(boardId: string) {
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(post)
    .where(and(eq(post.boardId, boardId), eq(post.status, "published")));
  return count;
}

async function assertOwnsPost(postId: string, ownerId: string) {
  const [row] = await db
    .select({ postId: post.id, mediaUrl: post.mediaUrl })
    .from(post)
    .innerJoin(board, eq(post.boardId, board.id))
    .where(and(eq(post.id, postId), eq(board.ownerId, ownerId)));
  return row ?? null;
}

export async function hidePost(postId: string, ownerId: string) {
  const owned = await assertOwnsPost(postId, ownerId);
  if (!owned) return null;
  const [row] = await db.update(post).set({ status: "hidden" }).where(eq(post.id, postId)).returning();
  return row;
}

export async function unhidePost(postId: string, ownerId: string) {
  const owned = await assertOwnsPost(postId, ownerId);
  if (!owned) return null;
  const [row] = await db.update(post).set({ status: "published" }).where(eq(post.id, postId)).returning();
  return row;
}

export async function pinPost(postId: string, ownerId: string, pinned: boolean) {
  const owned = await assertOwnsPost(postId, ownerId);
  if (!owned) return null;
  const [row] = await db.update(post).set({ pinned }).where(eq(post.id, postId)).returning();
  return row;
}

export async function deletePost(postId: string, ownerId: string) {
  const owned = await assertOwnsPost(postId, ownerId);
  if (!owned) return null;
  if (owned.mediaUrl) await deleteMedia(owned.mediaUrl);
  await db.delete(post).where(eq(post.id, postId));
  return true;
}

const REPORTS_PER_IP_PER_DAY = 20;

// Only published posts can be reported, hidden ones are already out of public view.
export async function getReportablePost(postId: string) {
  const [row] = await db
    .select({ id: post.id })
    .from(post)
    .where(and(eq(post.id, postId), eq(post.status, "published")));
  return row ?? null;
}

// One report per post per person, and a daily cap so the report button can't be used to
// flood an owner's moderation queue.
export async function checkReportRateLimit(ipHash: string, postId: string) {
  const [{ count: already }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(report)
    .where(and(eq(report.postId, postId), eq(report.reporterIpHash, ipHash)));
  if (already > 0) return { allowed: false as const, duplicate: true as const };

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(report)
    .where(and(eq(report.reporterIpHash, ipHash), gte(report.createdAt, oneDayAgo)));
  if (count >= REPORTS_PER_IP_PER_DAY) {
    return {
      allowed: false as const,
      duplicate: false as const,
      reason: "You've sent a lot of reports today, please try again tomorrow.",
    };
  }

  return { allowed: true as const };
}

export async function reportPost(postId: string, reason: string, ipHash: string) {
  await db.insert(report).values({ postId, reason, reporterIpHash: ipHash });
}

// Reaction totals for a set of posts: { postId: { emoji: count } }.
export async function listReactionCounts(postIds: string[]) {
  const out: Record<string, Record<string, number>> = {};
  if (postIds.length === 0) return out;
  const rows = await db
    .select({ postId: reaction.postId, emoji: reaction.emoji, count: sql<number>`count(*)::int` })
    .from(reaction)
    .where(inArray(reaction.postId, postIds))
    .groupBy(reaction.postId, reaction.emoji);
  for (const r of rows) (out[r.postId] ??= {})[r.emoji] = r.count;
  return out;
}

// What a reaction needs to be validated: the post must be published, and we need its
// board (for the private check) and motion profile (for the allowed emoji).
export async function getReactablePost(postId: string) {
  const [row] = await db
    .select({
      postId: post.id,
      board: { id: board.id, slug: board.slug, ownerId: board.ownerId, visibility: board.visibility },
      profile: occasionType.motionProfile,
    })
    .from(post)
    .innerJoin(board, eq(post.boardId, board.id))
    .innerJoin(occasionType, eq(board.occasionTypeId, occasionType.id))
    .where(and(eq(post.id, postId), eq(post.status, "published")));
  return row ?? null;
}

// Adds the reaction, or removes it if this person already left that emoji.
export async function toggleReaction(postId: string, emoji: string, fingerprint: string) {
  const removed = await db
    .delete(reaction)
    .where(and(eq(reaction.postId, postId), eq(reaction.emoji, emoji), eq(reaction.fingerprint, fingerprint)))
    .returning({ id: reaction.id });
  if (removed.length === 0) {
    await db.insert(reaction).values({ postId, emoji, fingerprint }).onConflictDoNothing();
  }
  return (await listReactionCounts([postId]))[postId] ?? {};
}

// Attach posts written from this browser (ids from the post cookie) to a now-signed-in
// user. Only rows with no owner yet, so it can never steal someone else's post.
export async function claimPostsForUser(postIds: string[], userId: string) {
  if (postIds.length === 0) return 0;
  const rows = await db
    .update(post)
    .set({ userId })
    .where(and(inArray(post.id, postIds), isNull(post.userId)))
    .returning({ id: post.id });
  return rows.length;
}
