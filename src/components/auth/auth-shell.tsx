import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Reveal } from "@/components/board/reveal";

const PANEL_CARDS = [
  { body: "Can't believe you're turning 30! So proud of the person you've become.", author: "Dara", bg: "#FFF8EC", accent: "#FF7A3D", rotate: -5 },
  { body: "Thinking of you today and always. She would be so proud.", author: "Aunty Blessing", bg: "#F7F6F4", accent: "#6B675E", rotate: 4 },
] as const;

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-full flex-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[var(--brand-ink)] lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 15%, rgba(196,113,63,0.5), transparent), radial-gradient(50% 45% at 85% 85%, rgba(242,228,188,0.18), transparent)",
          }}
        />

        <Link href="/" className="relative flex items-center gap-2.5 font-heading text-xl text-white">
          <LogoMark className="h-6 w-6 shrink-0" color="var(--brand-soft)" />
          Fondly Held
        </Link>

        <div className="relative">
          <p className="max-w-sm font-heading text-3xl leading-snug text-white">
            One link. Everyone contributes. Nothing to manage but the memory.
          </p>

          <div className="relative mt-12 h-40">
            {PANEL_CARDS.map((card, i) => (
              <Reveal
                key={i}
                profile="warm"
                delay={0.2 + i * 0.15}
                className={i === 0 ? "absolute top-0 left-0 w-60" : "absolute top-8 left-32 w-60"}
              >
                <div
                  className="rounded-2xl border border-black/5 p-4 shadow-xl"
                  style={{ background: card.bg, transform: `rotate(${card.rotate}deg)` }}
                >
                  <p className="text-[13px] leading-relaxed text-black/80">{card.body}</p>
                  <p className="mt-2 text-xs font-medium" style={{ color: card.accent }}>
                    — {card.author}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-white/50">Free while we&apos;re growing. Every feature, no account required to post.</p>
      </div>

      <div className="flex items-center justify-center bg-[var(--background)] px-6 py-16">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
