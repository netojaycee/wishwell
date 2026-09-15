// Ambient background per motion profile — the single switch point for "never confetti
// on solemn" (CLAUDE.md's worst-possible-bug rule). Warm/solemn are pure CSS (no JS,
// no bundle cost); celebratory mounts the one-shot confetti client component.
import { ConfettiBurst } from "./confetti-burst";

export function BoardAmbient({
  motionProfile,
  accent,
  accentSoft,
}: {
  motionProfile: "celebratory" | "warm" | "solemn";
  accent: string;
  accentSoft: string;
}) {
  if (motionProfile === "celebratory") {
    return <ConfettiBurst accent={accent} accentSoft={accentSoft} />;
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

  // solemn: still, faint grain only — never movement, never scale.
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
