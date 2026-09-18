"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import * as posts from "@/lib/data/posts";
import { redirect } from "next/navigation";
import { deleteBoardWithMedia, getBoardById, setBoardDelivery, updateBoardDetails } from "@/lib/data/boards";
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

export async function deleteBoardAction(boardId: string) {
  const session = await requireSession();
  const deleted = await deleteBoardWithMedia(boardId, session.user.id);
  if (!deleted) return { ok: false as const, error: "We couldn't find that board. It may already be deleted." };
  revalidatePath(`/b/${deleted.slug}`);
  revalidatePath("/dashboard");
  redirect("/dashboard?deleted=1");
}

// Delivery moment (collaborative boards). "schedule" sets or clears the date posting
// closes; "deliver" closes posting now; "reopen" takes new messages again.
export async function updateDeliveryAction(
  boardId: string,
  slug: string,
  input: { kind: "schedule"; deliverAt: string | null } | { kind: "deliver" } | { kind: "reopen" }
) {
  const session = await requireSession();
  let change: Parameters<typeof setBoardDelivery>[2];
  if (input.kind === "schedule") {
    const when = input.deliverAt ? new Date(input.deliverAt) : null;
    if (when && Number.isNaN(when.getTime())) return { ok: false as const, error: "That date doesn't look right." };
    if (when && when.getTime() <= Date.now()) {
      return { ok: false as const, error: "Pick a time in the future, or use Deliver now." };
    }
    change = { deliverAt: when };
  } else if (input.kind === "deliver") {
    change = { status: "delivered", closedAt: new Date() };
  } else {
    change = { status: "collecting", closedAt: null, deliverAt: null };
  }
  const updated = await setBoardDelivery(boardId, session.user.id, change);
  if (!updated) return { ok: false as const, error: "We couldn't update this board. Please try again." };
  await revalidateBoardBySlug(slug);
  return { ok: true as const };
}
