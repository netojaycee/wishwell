// Remembers, per browser, which posts a signed-out visitor wrote so they can be linked to an
// account created later (see claimWrittenPosts in claim.ts). Ids only, httpOnly, capped.
import "server-only";
import type { cookies } from "next/headers";

export const WRITTEN_POSTS_COOKIE = "fondlyheld_posts";
const MAX_IDS = 50;

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export function readWrittenPostIds(store: CookieStore): string[] {
  const raw = store.get(WRITTEN_POSTS_COOKIE)?.value ?? "";
  return raw.split(",").filter((id) => /^[0-9a-f-]{36}$/i.test(id));
}

export async function addWrittenPostCookie(store: CookieStore, postId: string) {
  const ids = [...readWrittenPostIds(store), postId].slice(-MAX_IDS);
  store.set(WRITTEN_POSTS_COOKIE, ids.join(","), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
