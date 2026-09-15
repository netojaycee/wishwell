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

export default async function HomePage() {
  const occasions = await listOccasionsWithThemes();

  return (
    <div>
      <section className="mx-auto max-w-3xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <Reveal profile="warm">
          <h1 className="font-heading text-4xl leading-tight sm:text-6xl">
            Beautiful group cards, for every occasion.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-black/60">
            One link, everyone contributes. Collect messages, photos and videos on a
            beautiful page the recipient keeps forever — free, no signup required to post.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/create"
              className="rounded-full bg-black px-7 py-3 text-sm font-semibold text-white"
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
        </Reveal>
      </section>

      <section id="occasions" className="mx-auto max-w-5xl px-6 pb-20">
        <h2 className="font-heading text-2xl">Pick an occasion</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {occasions.map((o) => (
            <Link
              key={o.key}
              href={`/occasions/${o.key}`}
              className="rounded-2xl border border-black/10 p-4 transition hover:-translate-y-0.5 hover:shadow-sm"
              style={{ background: o.themes[0]?.palette.bg }}
            >
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ background: o.themes[0]?.palette.accent }}
              />
              <p className="mt-2 text-sm font-medium">{o.label}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-black/5 bg-neutral-50">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="font-heading text-2xl">How it works</h2>
          <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Create a board", body: "Pick an occasion, add a name and a theme. Takes a minute — no account needed." },
              { step: "2", title: "Share the link", body: "Send it to whoever you want — WhatsApp, email, Slack. Anyone can post, no signup." },
              { step: "3", title: "Keep it forever", body: "Messages, photos and videos land on one beautiful page the recipient can revisit anytime." },
            ].map((s) => (
              <div key={s.step}>
                <span className="font-heading text-3xl text-black/20">{s.step}</span>
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
