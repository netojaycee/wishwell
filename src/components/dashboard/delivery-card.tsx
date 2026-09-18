"use client";

// The delivery moment for collaborative boards (DESIGN.md signature moment #1): the owner
// sets when messages close, or delivers now, and shares a recipient link that opens the
// board with a reveal. Tribute boards are open-ended and don't get this card.
import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Gift } from "lucide-react";
import { updateDeliveryAction } from "@/app/actions/moderation";
import { isPostingClosed } from "@/lib/board-state";
import { track } from "@/lib/analytics";
import type { BoardWithRelations } from "@/lib/types";

// <input type="datetime-local"> wants local "YYYY-MM-DDTHH:mm".
function toLocalInput(value: Date | string | null) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

// Dates are shown in the owner's own timezone, which the server doesn't know, so they
// render only on the client (avoids an SSR/hydration mismatch).
const subscribe = () => () => {};
function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}

const DATE_FMT: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" };

export function DeliveryCard({ board }: { board: BoardWithRelations }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isClient = useIsClient();
  const [edited, setEdited] = useState<string | null>(null);
  const when = edited ?? (isClient ? toLocalInput(board.deliverAt) : "");
  const fmt = (d: Date | string) => (isClient ? new Date(d).toLocaleString(undefined, DATE_FMT) : "");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const closed = isPostingClosed(board);

  const run = (input: Parameters<typeof updateDeliveryAction>[2]) =>
    startTransition(async () => {
      setError(null);
      const result = await updateDeliveryAction(board.id, board.slug, input);
      if (!result.ok) setError(result.error);
      else router.refresh();
    });

  const copyRevealLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/b/${board.slug}?reveal=1`);
    setCopied(true);
    track("board_link_shared", { via: "recipient_reveal" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
      <h2 className="flex items-center gap-2 font-heading text-lg">
        <Gift size={18} strokeWidth={1.75} className="text-[var(--brand)]" /> Delivery
      </h2>

      {closed ? (
        <p className="mt-2 rounded-lg bg-[var(--brand-soft)]/60 px-3 py-2 text-sm text-[var(--brand-ink)]">
          {board.status === "delivered" && board.closedAt
            ? `Delivered ${fmt(board.closedAt)}. New messages are closed.`
            : "Messages are closed."}
        </p>
      ) : (
        <>
          <label className="mt-3 block text-xs font-medium text-black/60">
            Close messages on (optional)
            <input
              type="datetime-local"
              value={when}
              onChange={(e) => setEdited(e.target.value)}
              className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:border-[var(--brand)] focus:outline-none"
            />
          </label>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => run({ kind: "schedule", deliverAt: when ? new Date(when).toISOString() : null })}
              className="flex-1 rounded-full border border-black/10 bg-white px-3 py-2 text-sm font-medium hover:border-black/20 disabled:opacity-50"
            >
              {when ? "Save date" : "No close date"}
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => run({ kind: "deliver" })}
              className="flex-1 rounded-full bg-[var(--brand-ink)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)] disabled:opacity-50"
            >
              Deliver now
            </button>
          </div>
          {board.deliverAt ? (
            <p className="mt-2 text-xs text-black/50">
              Messages close {fmt(board.deliverAt)}.
            </p>
          ) : null}
        </>
      )}

      <p className="mt-4 text-xs leading-relaxed text-black/55">
        Send {board.recipientName} this link. It opens the board with a little reveal, made for the
        moment they first see it.
      </p>
      <button
        type="button"
        onClick={copyRevealLink}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:border-black/20"
      >
        {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Link copied" : "Copy recipient link"}
      </button>

      {closed ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => run({ kind: "reopen" })}
          className="mt-2 w-full text-center text-xs font-medium text-black/50 underline underline-offset-2 hover:text-black disabled:opacity-50"
        >
          Reopen for new messages
        </button>
      ) : null}

      {error ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
