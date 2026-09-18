// Anonymous post creation. A route handler, not a Server Action, so rate limiting and
// bot checks are explicit and unambiguous (see ARCHITECTURE.md, "Rendering & caching").
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getBoardBySlug } from "@/lib/data/boards";
import { canViewBoard } from "@/lib/access";
import { isGiphyUrl, isPostMediaUrl } from "@/lib/media";
import { isPostingClosed } from "@/lib/board-state";
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
  if (!(await canViewBoard(board))) {
    return NextResponse.json({ ok: false, error: "This board is private." }, { status: 403 });
  }
  if (isPostingClosed(board)) {
    return NextResponse.json(
      { ok: false, error: "This board has been delivered and isn't taking new messages." },
      { status: 403 }
    );
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

  // Media must be ours (R2 posts/) or GIPHY's, and match its declared type.
  const mediaOk =
    input.mediaType === "none"
      ? !input.mediaUrl && !input.gifUrl
      : input.mediaType === "gif"
        ? Boolean(input.gifUrl && isGiphyUrl(input.gifUrl)) && !input.mediaUrl
        : Boolean(input.mediaUrl && isPostMediaUrl(input.mediaUrl)) && !input.gifUrl;
  if (!mediaOk) {
    return NextResponse.json(
      { ok: false, error: "That attachment didn't upload properly. Please remove it and try again." },
      { status: 400 }
    );
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
