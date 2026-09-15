import { and, asc, desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { board, post, report } from "@/db/schema";
import { deleteMedia } from "@/lib/media";
import type { CreatePostInput } from "@/lib/validation/post";

export async function createPost(boardId: string, input: Omit<CreatePostInput, "website" | "renderedAt">, ipHash: string) {
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

// Owner moderation view: everything, including hidden/pending, oldest problems first.
export async function listAllPostsForModeration(boardId: string) {
  return db.select().from(post).where(eq(post.boardId, boardId)).orderBy(asc(post.createdAt));
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

export async function reportPost(postId: string, reason: string) {
  await db.insert(report).values({ postId, reason });
}
