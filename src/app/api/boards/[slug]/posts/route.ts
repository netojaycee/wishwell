// Anonymous post creation. A route handler, not a Server Action, so rate limiting and
// bot checks are explicit and unambiguous (see ARCHITECTURE.md, "Rendering & caching").
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBoardBySlug } from "@/lib/data/boards";
import { createPost } from "@/lib/data/posts";
import { checkPostRateLimit } from "@/lib/rate-limit";
import { sanitizePostBody, sanitizePlainText } from "@/lib/sanitize";
import { hashIp, requestIp } from "@/lib/hash";
import { createPostSchema, MIN_SUBMIT_MS } from "@/lib/validation/post";

export async function POST(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) {
    return NextResponse.json({ ok: false, error: "Board not found." }, { status: 404 });
  }
  if (board.status === "archived") {
    return NextResponse.json({ ok: false, error: "This board is no longer accepting posts." }, { status: 403 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createPostSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const input = parsed.data;

  // Honeypot + timing check instead of a captcha (CLAUDE.md: "keep friction at zero").
  if (input.website) {
    return NextResponse.json({ ok: true }); // pretend success, drop silently
  }
  if (Date.now() - input.renderedAt < MIN_SUBMIT_MS) {
    return NextResponse.json({ ok: true });
  }

  const ip = requestIp(request.headers);
  const ipHash = hashIp(ip);

  const rateLimit = await checkPostRateLimit(ipHash, board.id);
  if (!rateLimit.allowed) {
    return NextResponse.json({ ok: false, error: rateLimit.reason }, { status: 429 });
  }

  const post = await createPost(
    board.id,
    {
      authorName: sanitizePlainText(input.authorName),
      body: sanitizePostBody(input.body),
      mediaUrl: input.mediaUrl,
      mediaType: input.mediaType,
      gifUrl: input.gifUrl,
    },
    ipHash
  );

  revalidatePath(`/b/${slug}`);

  return NextResponse.json({ ok: true, post });
}
