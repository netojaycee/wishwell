import { NextResponse } from "next/server";
import { z } from "zod";
import { presignUpload } from "@/lib/media";
import { consumeRateLimit } from "@/lib/rate-limit";
import { hashIp, requestIp } from "@/lib/hash";

// Generous for real people (a board creator adds 4 photos, a contributor 1 or 2, plus
// retries), tight enough that nobody can use us as free file hosting.
const SIGNS_PER_HOUR = 40;

const schema = z.object({
  mimeType: z.string().min(1),
  sizeBytes: z.number().positive(),
  purpose: z.enum(["post", "recipient"]).optional(),
});

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid upload request." }, { status: 400 });
  }

  const allowed = await consumeRateLimit("upload-sign", hashIp(requestIp(request.headers)), SIGNS_PER_HOUR, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "You've uploaded a lot in the last hour. Please try again a little later." },
      { status: 429 }
    );
  }

  const result = await presignUpload(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
