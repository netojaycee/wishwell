import { NextResponse } from "next/server";
import { z } from "zod";
import { presignUpload } from "@/lib/media";

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

  const result = await presignUpload(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json(result);
}
