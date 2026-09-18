// Ambient background per motion profile, the single switch point for "never confetti
// on solemn" (CLAUDE.md's worst-possible-bug rule). Warm/solemn are pure CSS (no JS,
// no bundle cost); celebratory mounts the one-shot confetti client component plus a
// CSS-only layer of slowly rising balloons or drifting confetti, chosen by the theme's
// particleEffect (data, not occasion branching).
import type { CSSProperties } from "react";
import { ConfettiBurst } from "./confetti-burst";

// Deterministic placements, no Math.random, so server and client render identically.
// Negative delays start each piece mid-flight so the layer isn't empty on first paint.
const BALLOONS = [
  { left: "5%", size: 34, duration: 22, delay: -4, opacity: 0.45 },
  { left: "22%", size: 26, duration: 26, delay: -15, opacity: 0.35 },
  { left: "71%", size: 38, duration: 20, delay: -9, opacity: 0.4 },
  { left: "88%", size: 28, duration: 24, delay: -19, opacity: 0.35 },
  { left: "50%", size: 22, duration: 25, delay: -1, opacity: 0.3 },
];

const CONFETTI = [
  { left: "4%", w: 7, h: 12, duration: 16, delay: -2, soft: false },
  { left: "15%", w: 6, h: 10, duration: 21, delay: -11, soft: true },
  { left: "29%", w: 8, h: 8, duration: 18, delay: -6, soft: false },
  { left: "46%", w: 5, h: 11, duration: 24, delay: -17, soft: true },
  { left: "61%", w: 7, h: 12, duration: 17, delay: -9, soft: false },
  { left: "76%", w: 6, h: 9, duration: 22, delay: -3, soft: true },
  { left: "89%", w: 8, h: 12, duration: 19, delay: -13, soft: false },
  { left: "96%", w: 5, h: 8, duration: 26, delay: -20, soft: true },
];

function piece(duration: number, delay: number): CSSProperties {
  return { animationDuration: `${duration}s`, animationDelay: `${delay}s`, animationTimingFunction: "linear", animationIterationCount: "infinite" };
}

function CelebratoryLayer({ particleEffect, accent, accentSoft }: { particleEffect: string | null; accent: string; accentSoft: string }) {
  if (particleEffect === "balloons") {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {BALLOONS.map((b, i) => (
          <span
            key={i}
            className="fh-ambient-piece absolute top-full block"
            style={{ left: b.left, width: b.size, opacity: b.opacity, animationName: "fh-rise", ...piece(b.duration, b.delay) }}
          >
            <svg viewBox="0 0 40 64" className="block w-full">
              <ellipse cx="20" cy="20" rx="16" ry="19" fill={i % 2 ? accentSoft : accent} />
              <ellipse cx="14" cy="13" rx="4" ry="6" fill={i % 2 ? accent : accentSoft} opacity="0.45" />
              <path d="M17 38l3 4 3-4z" fill={i % 2 ? accentSoft : accent} />
              <path d="M20 42q-4 9 0 20" stroke={accent} strokeWidth="1" fill="none" opacity="0.5" />
            </svg>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {CONFETTI.map((c, i) => (
        <span
          key={i}
          className="fh-ambient-piece absolute top-0 block rounded-[2px]"
          style={{
            left: c.left,
            width: c.w,
            height: c.h,
            background: c.soft ? accentSoft : accent,
            opacity: 0.4,
            animationName: "fh-fall",
            ...piece(c.duration, c.delay),
          }}
        />
      ))}
    </div>
  );
}

export function BoardAmbient({
  motionProfile,
  accent,
  accentSoft,
  particleEffect = null,
}: {
  motionProfile: "celebratory" | "warm" | "solemn";
  accent: string;
  accentSoft: string;
  particleEffect?: string | null;
}) {
  if (motionProfile === "celebratory") {
    return (
      <>
        <ConfettiBurst accent={accent} accentSoft={accentSoft} />
        <CelebratoryLayer particleEffect={particleEffect} accent={accent} accentSoft={accentSoft} />
      </>
    );
  }

  if (motionProfile === "warm") {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 motion-reduce:animate-none animate-[drift_18s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(60% 50% at 20% 10%, ${accentSoft}, transparent), radial-gradient(50% 40% at 90% 30%, ${accentSoft}, transparent)`,
        }}
      />
    );
  }

  // solemn: still, faint grain only, never movement, never scale.
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}
