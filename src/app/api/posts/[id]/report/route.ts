// Anonymous "report this post" endpoint behind the global report button (CLAUDE.md
// guardrails: moderation from v1). A route handler, not a Server Action, so its rate limit
// is explicit — same reasoning as anonymous posting.
import { NextResponse } from "next/server";
import { z } from "zod";
import { checkReportRateLimit, getReportablePost, reportPost } from "@/lib/data/posts";
import { sanitizePlainText } from "@/lib/sanitize";
import { hashIp, requestIp } from "@/lib/hash";
import { reportSchema } from "@/lib/validation/report";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ ok: false, error: "This post no longer exists." }, { status: 404 });
  }

  const json = await request.json().catch(() => null);
  const parsed = reportSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Please choose a reason." },
      { status: 400 }
    );
  }
  if (parsed.data.website) return NextResponse.json({ ok: true }); // honeypot: drop silently

  const target = await getReportablePost(id);
  if (!target) {
    return NextResponse.json({ ok: false, error: "This post no longer exists." }, { status: 404 });
  }

  const ipHash = hashIp(requestIp(request.headers));
  const limit = await checkReportRateLimit(ipHash, id);
  if (!limit.allowed) {
    // Reporting the same post twice isn't an error from the reporter's point of view.
    if (limit.duplicate) return NextResponse.json({ ok: true });
    return NextResponse.json({ ok: false, error: limit.reason }, { status: 429 });
  }

  const details = parsed.data.details ? sanitizePlainText(parsed.data.details) : "";
  await reportPost(id, details ? `${parsed.data.reason}: ${details}` : parsed.data.reason, ipHash);

  return NextResponse.json({ ok: true });
}
