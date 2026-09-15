"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import * as posts from "@/lib/data/posts";
import { updateBoardDetails } from "@/lib/data/boards";

async function revalidateBoardBySlug(slug: string) {
  revalidatePath(`/b/${slug}`);
  revalidatePath(`/dashboard/b/${slug}`);
}

export async function hidePostAction(postId: string, slug: string) {
  const session = await requireSession();
  await posts.hidePost(postId, session.user.id);
  await revalidateBoardBySlug(slug);
}

export async function unhidePostAction(postId: string, slug: string) {
  const session = await requireSession();
  await posts.unhidePost(postId, session.user.id);
  await revalidateBoardBySlug(slug);
}

export async function pinPostAction(postId: string, pinned: boolean, slug: string) {
  const session = await requireSession();
  await posts.pinPost(postId, session.user.id, pinned);
  await revalidateBoardBySlug(slug);
}

export async function deletePostAction(postId: string, slug: string) {
  const session = await requireSession();
  await posts.deletePost(postId, session.user.id);
  await revalidateBoardBySlug(slug);
}

export async function updateBoardAction(
  boardId: string,
  slug: string,
  input: { title?: string; headline?: string; visibility?: "public" | "unlisted" | "private" }
) {
  const session = await requireSession();
  const updated = await updateBoardDetails(boardId, session.user.id, input);
  await revalidateBoardBySlug(slug);
  if (updated && updated.slug !== slug) revalidatePath(`/b/${updated.slug}`);
  return updated;
}
