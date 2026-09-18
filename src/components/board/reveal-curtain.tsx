"use client";

// The board reveal (DESIGN.md signature moment #1), shown when the recipient opens the
// link the owner sends them (/b/<slug>?reveal=1). A curtain in the board's colours with
// their photo and how many people wrote; tapping it parts the curtain onto the board.
// Celebratory boards then get confetti; solemn boards only ever fade. Two seconds max.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ConfettiBurst } from "./confetti-burst";

type Profile = "celebratory" | "warm" | "solemn";

export function RevealCurtain({
  recipientName,
  photo,
  postCount,
  mode,
  profile,
  accent,
  accentSoft,
}: {
  recipientName: string;
  photo: string | null;
  postCount: number;
  mode: "collaborative" | "tribute";
  profile: Profile;
  accent: string;
  accentSoft: string;
}) {
  const [phase, setPhase] = useState<"closed" | "opening" | "open">("closed");
  const reducedMotion = useReducedMotion();
  const part = !reducedMotion && profile !== "solemn";

  // Hold the page still behind the curtain; drop ?reveal from the URL once it's open so a
  // refresh or a shared copy of the link lands straight on the board.
  useEffect(() => {
    if (phase === "open") {
      document.body.style.overflow = "";
      const url = new URL(window.location.href);
      url.searchParams.delete("reveal");
      window.history.replaceState(null, "", url);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  const heading =
    mode === "tribute"
      ? `A page of memories for ${recipientName}`
      : postCount === 0
        ? "Your board is ready"
        : postCount === 1
          ? "Someone wrote to you"
          : `${postCount} messages, all for you`;

  const duration = reducedMotion ? 0.15 : profile === "solemn" ? 0.9 : 0.8;

  return (
    <>
      {phase === "open" && profile === "celebratory" ? <ConfettiBurst accent={accent} accentSoft={accentSoft} /> : null}
      <AnimatePresence>
        {phase !== "open" ? (
          <motion.div
            key="curtain"
            className={`fixed inset-0 z-[120] overflow-hidden ${phase === "closed" ? "" : "pointer-events-none"}`}
            // Parting halves are already off-screen, so only the plain fade needs an exit.
            exit={part ? undefined : { opacity: 0 }}
            transition={{ duration }}
            role="dialog"
            aria-modal="true"
            aria-label={heading}
          >
            {/* Two halves that slide apart. */}
            {[-1, 1].map((side) => (
              <motion.div
                key={side}
                className="absolute inset-y-0 w-1/2"
                style={{
                  left: side === -1 ? 0 : "50%",
                  background: `linear-gradient(${side === -1 ? 90 : 270}deg, var(--board-bg), var(--board-accent-soft))`,
                }}
                animate={phase === "opening" && part ? { x: `${side * 100}%` } : { x: 0 }}
                transition={{ duration, ease: [0.65, 0, 0.35, 1] }}
                onAnimationComplete={() => {
                  if (phase === "opening" && side === 1) setPhase("open");
                }}
              />
            ))}

            <motion.div
              className="relative flex h-full flex-col items-center justify-center px-8 text-center"
              animate={{ opacity: phase === "opening" ? 0 : 1 }}
              transition={{ duration: part ? 0.25 : duration }}
              onAnimationComplete={() => {
                if (phase === "opening" && !part) setPhase("open");
              }}
            >
              {photo ? (
                // eslint-disable-next-line @next/next/no-img-element -- user photo from R2; image optimization is off site-wide
                <img
                  src={photo}
                  alt=""
                  className="h-40 w-32 rounded-[1.75rem] border-4 object-cover object-[50%_30%] shadow-xl sm:h-52 sm:w-40"
                  style={{ borderColor: "var(--board-surface)" }}
                />
              ) : null}
              <p className="mt-8 text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: "var(--board-accent)" }}>
                For {recipientName}
              </p>
              <h1
                className="mt-3 max-w-md text-4xl leading-tight sm:text-5xl"
                style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
              >
                {heading}
              </h1>
              <button
                type="button"
                autoFocus
                onClick={() => {
                  setPhase("opening");
                  // Never strand someone behind the curtain if an animation callback is
                  // skipped (background tab, throttled frames): open on a timer too.
                  window.setTimeout(() => setPhase("open"), (duration + 0.25) * 1000);
                }}
                className="mt-10 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03]"
                style={{ background: "var(--board-accent)" }}
              >
                {mode === "tribute" ? "Open the page" : "Open your board"}
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
