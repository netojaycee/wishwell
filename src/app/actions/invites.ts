"use server";

import { db } from "@/db";
import { invite } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { getBoardBySlug } from "@/lib/data/boards";
import { sendBoardInviteEmail } from "@/lib/email";
import { sanitizePlainText } from "@/lib/sanitize";
import { env } from "@/lib/env";
import { z } from "zod";

const emailSchema = z.string().trim().email();

export async function sendInviteAction(slug: string, rawEmail: string) {
  const session = await requireSession();
  const board = await getBoardBySlug(slug);
  if (!board || board.ownerId !== session.user.id) {
    return { ok: false as const, error: "Board not found." };
  }

  const parsed = emailSchema.safeParse(sanitizePlainText(rawEmail));
  if (!parsed.success) {
    return { ok: false as const, error: "Enter a valid email address." };
  }

  // The token doubles as the key to a private board: /b/<slug>?invite=<token> (see proxy.ts).
  const token = crypto.randomUUID();
  const boardUrl = `${env.NEXT_PUBLIC_APP_URL}/b/${board.slug}?invite=${token}`;
  const result = await sendBoardInviteEmail({
    to: parsed.data,
    boardTitle: board.title,
    boardUrl,
    isPrivate: board.visibility === "private",
  });

  await db.insert(invite).values({
    boardId: board.id,
    email: parsed.data,
    token,
    sentAt: result.ok ? new Date() : null,
  });

  return result;
}
