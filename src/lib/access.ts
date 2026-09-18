// Who may open a board. Public and unlisted boards are open to anyone with the link;
// private boards only to their owner or someone holding a valid invite token (the proxy
// moves ?invite=<token> from an invite email into a per-board cookie, see src/proxy.ts).
import "server-only";
import { cookies } from "next/headers";
import { after } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { invite } from "@/db/schema";
import { getSession } from "@/lib/session";
import { inviteCookieName } from "@/lib/board-state";

type AccessBoard = { id: string; slug: string; ownerId: string | null; visibility: "public" | "unlisted" | "private" };

export async function canViewBoard(board: AccessBoard) {
  if (board.visibility !== "private") return true;

  const session = await getSession();
  if (session && session.user.id === board.ownerId) return true;

  const token = (await cookies()).get(inviteCookieName(board.slug))?.value;
  if (!token) return false;
  const [row] = await db
    .select({ id: invite.id, openedAt: invite.openedAt })
    .from(invite)
    .where(and(eq(invite.boardId, board.id), eq(invite.token, token)));
  if (!row) return false;

  if (!row.openedAt) {
    after(() => db.update(invite).set({ openedAt: new Date() }).where(eq(invite.id, row.id)));
  }
  return true;
}
