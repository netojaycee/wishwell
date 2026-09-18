// Postgres-backed rate limiting for anonymous posting, no Redis dependency, so it
// works identically on Vercel, local dev, and the eventual VPS (see ARCHITECTURE.md
// guardrails: "Rate-limit anonymous posting endpoints").
import { and, eq, gte, sql } from "drizzle-orm";
import { db } from "@/db";
import { post, rateEvent } from "@/db/schema";

const PER_BOARD_PER_HOUR = 5;
const GLOBAL_PER_DAY = 20;

export async function checkPostRateLimit(ipHash: string, boardId: string) {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [{ count: perBoardCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(post)
    .where(and(eq(post.boardId, boardId), eq(post.authorIpHash, ipHash), gte(post.createdAt, oneHourAgo)));

  if (perBoardCount >= PER_BOARD_PER_HOUR) {
    return { allowed: false as const, reason: "Too many posts to this board, try again in a bit." };
  }

  const [{ count: globalCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(post)
    .where(and(eq(post.authorIpHash, ipHash), gte(post.createdAt, oneDayAgo)));

  if (globalCount >= GLOBAL_PER_DAY) {
    return { allowed: false as const, reason: "You've reached today's posting limit, try again tomorrow." };
  }

  return { allowed: true as const };
}

// Counts this key's events in the window and, if under the limit, records one more.
// Not strictly atomic, which is fine for abuse throttling (a burst can overshoot by a few).
export async function consumeRateLimit(bucket: string, key: string, limit: number, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(rateEvent)
    .where(and(eq(rateEvent.bucket, bucket), eq(rateEvent.key, key), gte(rateEvent.createdAt, since)));
  if (count >= limit) return false;
  await db.insert(rateEvent).values({ bucket, key });
  return true;
}
