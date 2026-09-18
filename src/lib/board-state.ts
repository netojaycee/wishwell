// Pure board state rules, safe to import on the client. Collaborative boards have a
// delivery moment: once delivered (or past their delivery date) posting closes. Tribute
// boards are open-ended and never close on their own (ARCHITECTURE.md: mode).
type BoardStateInput = {
  mode: "collaborative" | "tribute";
  status: "draft" | "collecting" | "delivered" | "archived";
  deliverAt: Date | string | null;
  closedAt: Date | string | null;
};

export function isPostingClosed(board: BoardStateInput, now = new Date()) {
  if (board.status === "archived" || board.status === "delivered" || board.closedAt) return true;
  if (board.mode === "collaborative" && board.deliverAt && new Date(board.deliverAt) <= now) return true;
  return false;
}

export function inviteCookieName(slug: string) {
  return `fh_inv_${slug}`;
}
