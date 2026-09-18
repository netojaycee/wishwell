"use client";

// Small emoji reactions under a post, no account needed. The emoji set follows the board's
// motion profile (see src/lib/reactions.ts). Which ones *you* left is remembered in this
// browser only; counts are owned by the parent (so the card and the lightbox agree),
// updated optimistically and then replaced by the server's totals.
import { useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "motion/react";
import { REACTIONS, type ReactionCounts } from "@/lib/reactions";

type Profile = keyof typeof REACTIONS;
const EVENT = "fh-reactions";

function storageKey(postId: string) {
  return `fh_rx_${postId}`;
}

function readMine(postId: string) {
  try {
    return localStorage.getItem(storageKey(postId)) ?? "";
  } catch {
    return "";
  }
}

function clientId() {
  try {
    let id = localStorage.getItem("fh_client");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("fh_client", id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

export function ReactionBar({
  postId,
  profile,
  counts,
  onCountsChange,
  size = "sm",
}: {
  postId: string;
  profile: Profile;
  counts: ReactionCounts;
  onCountsChange: (counts: ReactionCounts) => void;
  size?: "sm" | "lg";
}) {
  const setCounts = onCountsChange;
  const [error, setError] = useState(false);
  const mineRaw = useSyncExternalStore(subscribe, () => readMine(postId), () => "");
  const mine = new Set(mineRaw ? mineRaw.split(",") : []);
  const reducedMotion = useReducedMotion();
  const playful = profile === "celebratory" && !reducedMotion;

  const writeMine = (next: Set<string>) => {
    try {
      localStorage.setItem(storageKey(postId), [...next].join(","));
    } catch {
      // storage unavailable (private mode): highlighting just won't persist
    }
    window.dispatchEvent(new Event(EVENT));
  };

  const toggle = async (emoji: string) => {
    setError(false);
    const had = mine.has(emoji);
    const nextMine = new Set(mine);
    if (had) nextMine.delete(emoji);
    else nextMine.add(emoji);
    const before = counts;
    setCounts({ ...counts, [emoji]: Math.max(0, (counts[emoji] ?? 0) + (had ? -1 : 1)) });
    writeMine(nextMine);

    try {
      const res = await fetch(`/api/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emoji, clientId: clientId() }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error();
      setCounts(data.counts);
    } catch {
      setCounts(before);
      writeMine(mine);
      setError(true);
    }
  };

  const lg = size === "lg";

  return (
    <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Reactions">
      {REACTIONS[profile].map((emoji) => {
        const count = counts[emoji] ?? 0;
        const active = mine.has(emoji);
        return (
          <motion.button
            key={emoji}
            type="button"
            onClick={() => toggle(emoji)}
            whileTap={playful ? { scale: 1.25 } : undefined}
            aria-pressed={active}
            aria-label={`${emoji} ${count}`}
            className={`inline-flex items-center gap-1 rounded-full border transition-colors ${
              lg ? "px-3 py-1.5 text-base" : "px-2 py-0.5 text-sm"
            }`}
            style={{
              borderColor: active ? "var(--board-accent)" : "color-mix(in srgb, var(--board-ink) 12%, transparent)",
              background: active ? "var(--board-accent-soft)" : "transparent",
              color: "var(--board-ink)",
            }}
          >
            <span aria-hidden>{emoji}</span>
            {count > 0 ? <span className="text-xs font-medium tabular-nums opacity-70">{count}</span> : null}
          </motion.button>
        );
      })}
      {error ? <span className="text-xs text-[var(--board-ink)]/50">Couldn&apos;t save that, try again.</span> : null}
    </div>
  );
}
