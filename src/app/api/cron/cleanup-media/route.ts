// Daily sweep (Vercel Cron, see vercel.json): deletes R2 uploads nothing references, e.g.
// photos removed in /create before the board existed, or a contributor who uploaded and
// then left. Only objects older than a day, so an upload for a form someone is still
// filling in is never touched. Also trims old rate-limit rows.
import { NextResponse } from "next/server";
import { lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { rateEvent } from "@/db/schema";
import { env, hasR2 } from "@/lib/env";
import { deleteMediaKeys, listUploadedObjects, mediaKeyFromUrl } from "@/lib/media";

const MIN_AGE_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>". Refuse to run without one.
  if (!env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const rateRows = await db
    .delete(rateEvent)
    .where(lt(rateEvent.createdAt, new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)))
    .returning({ id: rateEvent.id });

  if (!hasR2) return NextResponse.json({ ok: true, deleted: 0, rateRows: rateRows.length });

  // Every media URL still in use anywhere.
  const rows = await db.execute<{ url: string | null }>(sql`
    select media_url as url from post where media_url is not null
    union select cover_image_url from board where cover_image_url is not null
    union select jsonb_array_elements_text(recipient_photos) from board
  `);
  const referenced = new Set<string>();
  for (const r of rows) {
    const key = r.url ? mediaKeyFromUrl(r.url) : null;
    if (key) referenced.add(key);
  }

  const cutoff = Date.now() - MIN_AGE_MS;
  const objects = await listUploadedObjects();
  const orphans = objects.filter((o) => o.lastModified.getTime() < cutoff && !referenced.has(o.key)).map((o) => o.key);

  // Safety valve: if most of the bucket suddenly looks unused, something is misconfigured
  // (wrong DB, changed URLs), so refuse rather than wipe real memories.
  if (orphans.length > 20 && orphans.length > objects.length / 2) {
    console.error(`cleanup-media: refusing to delete ${orphans.length} of ${objects.length} objects`);
    return NextResponse.json({ ok: false, error: "Too many orphans, refusing.", orphans: orphans.length, total: objects.length }, { status: 409 });
  }

  const dryRun = new URL(request.url).searchParams.has("dry");
  if (orphans.length && !dryRun) await deleteMediaKeys(orphans);
  return NextResponse.json({ ok: true, dryRun, orphans: orphans.length, total: objects.length, referenced: referenced.size, rateRows: rateRows.length });
}
