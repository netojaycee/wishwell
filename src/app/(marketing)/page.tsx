import Link from "next/link";
import type { Metadata } from "next";
import { listOccasionsWithThemes } from "@/lib/data/occasions";
import { Reveal } from "@/components/board/reveal";

export const metadata: Metadata = {
  title: "Fondly Held — beautiful group cards for every occasion",
  description:
    "One link, everyone contributes. Beautiful group cards and tribute pages for every occasion — free, no signup required to post.",
};

export const revalidate = 3600;

const HERO_CARDS = [
  {
    body: "Can't believe you're turning 30! So proud of the person you've become.",
    author: "Dara",
    bg: "#FFF8EC",
    accent: "#FF7A3D",
    rotate: -6,
    pos: "left-0 top-6",
  },
  {
    body: "We'll miss you at the office, but I know great things are ahead. Go make it count.",
    author: "The whole team",
    bg: "#F7FAF5",
    accent: "#6E8F63",
    rotate: 4,
    pos: "right-0 top-0",
  },
  {
    body: "Thinking of you today and always. She would be so proud.",
    author: "Aunty Blessing",
    bg: "#F7F6F4",
    accent: "#6B675E",
    rotate: -3,
    pos: "right-6 bottom-0",
  },
] as const;

export default async function HomePage() {
  const occasions = await listOccasionsWithThemes();

  return (
    <div>
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(55% 45% at 15% 15%, rgba(196,113,63,0.14), transparent), radial-gradient(50% 40% at 90% 10%, rgba(110,143,99,0.12), transparent), radial-gradient(45% 40% at 85% 90%, rgba(107,103,94,0.10), transparent)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-20 pb-24 sm:pt-28 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-4">
          <Reveal profile="warm">
            <div className="text-center lg:text-left">
              <h1 className="font-heading text-4xl leading-tight sm:text-6xl lg:text-6xl xl:text-7xl">
                Beautiful group cards, for every occasion.
              </h1>
              <p className="mx-auto mt-5 max-w-xl text-lg text-black/60 lg:mx-0">
                One link, everyone contributes. Collect messages, photos and videos on a
                beautiful page the recipient keeps forever — free, no signup required to
                post.
              </p>
              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/create"
                  className="rounded-full bg-[var(--brand-ink)] px-7 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                >
                  Create a free board
                </Link>
                <Link
                  href="#occasions"
                  className="rounded-full border border-black/15 px-7 py-3 text-sm font-semibold"
                >
                  See occasions
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Card collage — fills the lateral space on desktop and shows the product
              itself, across a celebratory / warm / solemn spread so the pitch ("every
              occasion") is immediately visible rather than just claimed in text. */}
          <div className="relative hidden h-[360px] w-[420px] shrink-0 lg:block" aria-hidden>
            {HERO_CARDS.map((card, i) => (
              <Reveal key={i} profile="warm" delay={0.15 + i * 0.1} className={`absolute w-64 ${card.pos}`}>
                <div
                  className="rounded-2xl border border-black/5 p-5 shadow-lg"
                  style={{ background: card.bg, transform: `rotate(${card.rotate}deg)` }}
                >
                  <p className="text-[14px] leading-relaxed text-black/80">{card.body}</p>
                  <p className="mt-3 text-sm font-medium" style={{ color: card.accent }}>
                    — {card.author}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="occasions" className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="font-heading text-2xl">Pick an occasion</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {occasions.map((o) => (
            <Link
              key={o.key}
              href={`/occasions/${o.key}`}
              className="rounded-2xl border border-black/10 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              style={{ background: o.themes[0]?.palette.bg }}
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: o.themes[0]?.palette.accent }}
              />
              <p className="mt-3 text-sm font-medium">{o.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-black/5 bg-[var(--brand-soft)]/30">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <h2 className="font-heading text-2xl">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Create a board", body: "Pick an occasion, add a name and a theme. Takes a minute — no account needed." },
              { step: "2", title: "Share the link", body: "Send it to whoever you want — WhatsApp, email, Slack. Anyone can post, no signup." },
              { step: "3", title: "Keep it forever", body: "Messages, photos and videos land on one beautiful page the recipient can revisit anytime." },
            ].map((s) => (
              <div key={s.step}>
                <span className="font-heading text-3xl" style={{ color: "var(--brand)" }}>
                  {s.step}
                </span>
                <h3 className="mt-2 font-medium">{s.title}</h3>
                <p className="mt-1 text-sm text-black/60">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
