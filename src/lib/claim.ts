"use server";

// Attaches any guest-created boards (identified by a `fondlyheld_claim_<slug>` cookie set
// in the create-board Server Action) to the now-signed-in owner. A Server Action (not a
// plain server-side function) because it deletes cookies, which Next only allows from a
// Server Action or Route Handler, called client-side once the dashboard mounts.
// See BUILD_PLAN.md: "claim the board by signing in after."
import { cookies } from "next/headers";
import { getSession } from "@/lib/session";
import { claimBoard } from "@/lib/data/boards";
import { claimPostsForUser } from "@/lib/data/posts";
import { readWrittenPostIds, WRITTEN_POSTS_COOKIE } from "@/lib/my-posts";

const CLAIM_PREFIX = "fondlyheld_claim_";

export async function claimPendingBoards(ownerId: string) {
  const store = await cookies();
  const claimCookies = store.getAll().filter((c) => c.name.startsWith(CLAIM_PREFIX));
  if (claimCookies.length === 0) return [];

  const claimed: string[] = [];

  for (const cookie of claimCookies) {
    const slug = cookie.name.slice(CLAIM_PREFIX.length);
    const board = await claimBoard(cookie.value, ownerId);
    if (board) claimed.push(slug);
    store.delete(cookie.name);
  }

  return claimed;
}

// Links messages written from this browser while signed out to the signed-in user.
export async function claimWrittenPosts() {
  const session = await getSession();
  if (!session) return 0;
  const userId = session.user.id;
  const store = await cookies();
  const ids = readWrittenPostIds(store);
  if (ids.length === 0) return 0;
  const count = await claimPostsForUser(ids, userId);
  store.delete(WRITTEN_POSTS_COOKIE);
  return count;
}
