"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import * as posts from "@/lib/data/posts";
import { getBoardById, updateBoardDetails } from "@/lib/data/boards";
import { deleteMedia, isRecipientPhotoUrl } from "@/lib/media";
import { sanitizePlainText } from "@/lib/sanitize";
import { boardSettingsSchema, type BoardSettingsValues } from "@/lib/validation/board";

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

export async function updateBoardAction(boardId: string, slug: string, input: BoardSettingsValues) {
  const session = await requireSession();
  const parsed = boardSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Please check the board details." };
  }

  const existing = await getBoardById(boardId);
  if (!existing || existing.ownerId !== session.user.id) {
    return { ok: false as const, error: "Board not found." };
  }

  // Photos already on the board are fine even if R2_PUBLIC_URL ever changes; new ones
  // must be recipient uploads we signed.
  const photos = parsed.data.recipientPhotos;
  if (!photos.every((url) => existing.recipientPhotos.includes(url) || isRecipientPhotoUrl(url))) {
    return { ok: false as const, error: "One of the photos didn't upload properly. Please remove it and try again." };
  }

  const updated = await updateBoardDetails(boardId, session.user.id, {
    recipientName: sanitizePlainText(parsed.data.recipientName),
    title: sanitizePlainText(parsed.data.title),
    headline: sanitizePlainText(parsed.data.headline) || null,
    recipientBio: sanitizePlainText(parsed.data.recipientBio) || null,
    recipientPhotos: photos,
    visibility: parsed.data.visibility,
  });
  if (!updated) return { ok: false as const, error: "We couldn't save those changes. Please try again." };

  // CLAUDE.md: media deletion must actually delete from object storage.
  const removed = existing.recipientPhotos.filter((url) => !photos.includes(url));
  await Promise.all(removed.map((url) => deleteMedia(url).catch(() => undefined)));

  await revalidateBoardBySlug(slug);
  revalidatePath("/dashboard");
  return { ok: true as const };
}
