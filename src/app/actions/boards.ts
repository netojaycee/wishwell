"use server";

import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { createBoard } from "@/lib/data/boards";
import { getOccasionByKey } from "@/lib/data/occasions";
import { isRecipientPhotoUrl } from "@/lib/media";
import { sanitizePlainText } from "@/lib/sanitize";
import { createBoardSchema, type CreateBoardInput } from "@/lib/validation/board";

export async function createBoardAction(input: CreateBoardInput) {
  const parsed = createBoardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid board details." };
  }

  if (!parsed.data.recipientPhotos.every(isRecipientPhotoUrl)) {
    return { ok: false as const, error: "One of the photos didn't upload properly. Please remove it and try again." };
  }

  const occasion = await getOccasionByKey(parsed.data.occasionKey);
  if (!occasion) {
    return { ok: false as const, error: "Unknown occasion." };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const ownerId = session?.user.id ?? null;

  const board = await createBoard(
    {
      ...parsed.data,
      recipientName: sanitizePlainText(parsed.data.recipientName),
      title: sanitizePlainText(parsed.data.title),
      headline: sanitizePlainText(parsed.data.headline) || null,
      recipientBio: sanitizePlainText(parsed.data.recipientBio) || null,
    },
    occasion.id,
    occasion.label,
    ownerId
  );

  // Guest-created boards get a claim token so /dashboard can offer "claim this board"
  // after the creator signs in (BUILD_PLAN.md: "Guest creation allowed; claim the
  // board by signing in after. Removes all friction from the top of funnel.")
  if (!ownerId && board.claimToken) {
    const store = await cookies();
    store.set(`fondlyheld_claim_${board.slug}`, board.claimToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return { ok: true as const, slug: board.slug };
}
