"use server";

import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { createBoard } from "@/lib/data/boards";
import { getOccasionByKey } from "@/lib/data/occasions";
import { createBoardSchema, type CreateBoardInput } from "@/lib/validation/board";

export async function createBoardAction(input: CreateBoardInput) {
  const parsed = createBoardSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: parsed.error.issues[0]?.message ?? "Invalid board details." };
  }

  const occasion = await getOccasionByKey(parsed.data.occasionKey);
  if (!occasion) {
    return { ok: false as const, error: "Unknown occasion." };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const ownerId = session?.user.id ?? null;

  const board = await createBoard(parsed.data, occasion.label, ownerId);

  // Guest-created boards get a claim token so /dashboard can offer "claim this board"
  // after the creator signs in (BUILD_PLAN.md: "Guest creation allowed; claim the
  // board by signing in after. Removes all friction from the top of funnel.")
  if (!ownerId && board.claimToken) {
    const store = await cookies();
    store.set(`wishwell_claim_${board.slug}`, board.claimToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });
  }

  return { ok: true as const, slug: board.slug };
}
