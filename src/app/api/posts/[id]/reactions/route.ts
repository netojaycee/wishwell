// Anonymous reactions on a post (toggle). A route handler like posting and reporting, so
// the rate limit is explicit. The fingerprint is a hash of a random per-browser id, so
// one browser gets one of each emoji per post and can take it back.
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { z } from "zod";
import { canViewBoard } from "@/lib/access";
import { getReactablePost, toggleReaction } from "@/lib/data/posts";
import { consumeRateLimit } from "@/lib/rate-limit";
import { hashIp, requestIp } from "@/lib/hash";
import { env } from "@/lib/env";
import { REACTIONS } from "@/lib/reactions";

const bodySchema = z.object({ emoji: z.string().min(1).max(16), clientId: z.string().uuid() });
const PER_HOUR = 120;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ ok: false, error: "This post no longer exists." }, { status: 404 });
  }
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid reaction." }, { status: 400 });

  const target = await getReactablePost(id);
  if (!target || !(await canViewBoard(target.board))) {
    return NextResponse.json({ ok: false, error: "This post no longer exists." }, { status: 404 });
  }
  if (!(REACTIONS[target.profile] as readonly string[]).includes(parsed.data.emoji)) {
    return NextResponse.json({ ok: false, error: "Invalid reaction." }, { status: 400 });
  }

  if (!(await consumeRateLimit("reaction", hashIp(requestIp(request.headers)), PER_HOUR, 60 * 60 * 1000))) {
    return NextResponse.json({ ok: false, error: "Slow down a little, then try again." }, { status: 429 });
  }

  const fingerprint = createHash("sha256").update(`${parsed.data.clientId}:${env.BETTER_AUTH_SECRET}`).digest("hex");
  const counts = await toggleReaction(id, parsed.data.emoji, fingerprint);
  return NextResponse.json({ ok: true, counts });
}
