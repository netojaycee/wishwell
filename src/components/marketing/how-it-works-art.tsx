// Small looping illustrations for the home page's three "How it works" steps — create,
// share, keep — built from HTML + `fh-*` keyframes in brand colours. Under reduced motion
// every piece simply rests in its final, fully visible pose (handled in globals.css).
import Image from "next/image";
import type { CSSProperties } from "react";
import { PHOTOS } from "@/lib/content/moments";

// Delayed looping keyframes must hold their 0% (hidden) frame during the delay, or the
// element flashes fully visible before its first cycle starts.
const staggered = (s: number, extra?: CSSProperties): CSSProperties => ({ animationDelay: `${s}s`, animationFillMode: "both", ...extra });

const CHIPS = ["Birthday", "Farewell", "Wedding", "Memorial", "Thank you", "New baby"];

export function CreateStepArt() {
  return (
    <div className="relative w-[184px] rounded-2xl border border-black/5 bg-white p-3 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]">
      <p className="font-heading text-[12px]" style={{ color: "var(--brand-ink)" }}>
        What&apos;s the occasion?
      </p>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        {CHIPS.map((chip, i) => (
          <span
            key={chip}
            className="rounded-lg px-2 py-1.5 text-[9.5px] font-medium"
            style={
              i === 0
                ? { background: "var(--brand)", color: "white" }
                : { background: "color-mix(in srgb, var(--brand-soft) 60%, transparent)", color: "var(--brand-ink)" }
            }
          >
            {chip}
          </span>
        ))}
      </div>
      <div className="mt-2.5 h-6 rounded-full text-center text-[9px] leading-6 font-semibold text-white" style={{ background: "var(--brand-ink)" }}>
        Continue
      </div>
      {/* pointer hovering the selected chip */}
      <svg viewBox="0 0 24 24" aria-hidden className="fh-float absolute top-[46px] left-[70px] h-6 w-6 drop-shadow">
        <path d="M5 3l14 8l-6 1.5L10 19Z" fill="white" stroke="var(--brand-ink)" strokeWidth="1.8" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function ShareStepArt() {
  return (
    <div className="w-[136px] rounded-[26px] border-[5px] bg-white p-2.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.3)]" style={{ borderColor: "var(--brand-ink)" }}>
      <div className="mx-auto mb-2.5 h-1 w-8 rounded-full bg-black/15" />
      <div className="space-y-1.5">
        <div className="fh-bubble max-w-[88%] rounded-2xl rounded-tl-sm bg-black/[0.06] px-2 py-1 text-[8.5px] leading-snug text-black/70" style={staggered(0)}>
          Signing a board for Tolu&apos;s 30th. Add yours!
        </div>
        <div className="fh-bubble ml-auto w-[90%] overflow-hidden rounded-2xl rounded-tr-sm shadow-sm" style={staggered(0.5, { background: "var(--brand-soft)" })}>
          <div className="relative h-12 w-full">
            <Image src={PHOTOS.birthdayCandles.src} alt="" fill sizes="120px" className="object-cover" />
          </div>
          <div className="px-2 py-1">
            <p className="text-[8.5px] font-semibold" style={{ color: "var(--brand-ink)" }}>
              Tolu turns 30
            </p>
            <p className="truncate text-[7.5px] text-black/50">/b/tolu-turns-30</p>
          </div>
        </div>
        <div className="fh-bubble max-w-[78%] rounded-2xl rounded-tl-sm bg-black/[0.06] px-2 py-1 text-[8.5px] leading-snug text-black/70" style={staggered(1.1)}>
          Done, that took a minute
        </div>
      </div>
    </div>
  );
}

const DROPS: { rot: string; kind: "photo" | "soft" | "plain" | "heart" }[] = [
  { rot: "-3deg", kind: "photo" },
  { rot: "2deg", kind: "soft" },
  { rot: "1.5deg", kind: "heart" },
  { rot: "-2deg", kind: "plain" },
];

export function BoardStepArt() {
  return (
    <div className="w-[184px] rounded-2xl border border-black/5 bg-white p-2.5 shadow-[0_12px_30px_-12px_rgba(0,0,0,0.25)]">
      <div className="mb-2 flex flex-col items-center gap-1">
        <span className="h-1.5 w-10 rounded-full" style={{ background: "var(--brand-soft)" }} />
        <span className="h-2 w-20 rounded-full" style={{ background: "var(--brand-ink)", opacity: 0.8 }} />
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {DROPS.map((d, i) => (
          <div
            key={i}
            className="fh-drop-in overflow-hidden rounded-lg border border-black/5"
            style={staggered(i * 0.45, {
              ["--fh-rot" as string]: d.rot,
              background: d.kind === "soft" ? "var(--brand-soft)" : "white",
            })}
          >
            {d.kind === "photo" ? (
              <div className="relative h-10 w-full">
                <Image src={PHOTOS.friendsLaughing.src} alt="" fill sizes="90px" className="object-cover" />
              </div>
            ) : d.kind === "heart" ? (
              <div className="flex h-10 items-center justify-center" style={{ background: "color-mix(in srgb, var(--brand) 12%, white)" }}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
                  <path d="M12 20C5 15 2 11 4 7c2-3 6-3 8 0c2-3 6-3 8 0c2 4-1 8-8 13Z" fill="var(--brand)" />
                </svg>
              </div>
            ) : null}
            <div className="space-y-1 p-1.5">
              <span className="block h-1 w-full rounded-full bg-black/15" />
              <span className="block h-1 w-2/3 rounded-full bg-black/15" />
              <span className="block h-1 w-1/3 rounded-full" style={{ background: "var(--brand)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
