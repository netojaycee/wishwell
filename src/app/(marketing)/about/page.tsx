import type { Metadata } from "next";
import { Gift, Infinity as InfinityIcon, ShieldCheck } from "lucide-react";
import { BrandPanel } from "@/components/brand/brand-panel";
import { Reveal } from "@/components/board/reveal";

export const metadata: Metadata = { title: "About" };

const PROMISES = [
  { icon: InfinityIcon, title: "Your board is yours forever", body: "No expiry dates and no archive fees." },
  { icon: ShieldCheck, title: "We never sell your data", body: "No ads, no data brokers. Delete anything, any time." },
  { icon: Gift, title: "Free — every feature", body: "And nobody needs an account to post." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-16 lg:py-20">
      <Reveal profile="warm">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-wide text-black/40 uppercase">About</p>
          <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl" style={{ color: "var(--brand-ink)" }}>
            About Fondly Held
          </h1>
          <p className="mt-6 leading-relaxed text-black/75">
            Fondly Held exists because the two products that already do this well have picked
            opposite lanes — one built for corporate celebrations, the other for grief — and
            neither is particularly beautiful. Most of life&apos;s occasions don&apos;t sort neatly into
            either box. Fondly Held is built to hold all of them: birthdays, farewells, weddings,
            memorials, and everything in between, in one product that takes the design
            seriously.
          </p>
          <p className="mt-4 leading-relaxed text-black/75">
            The idea is simple: one link, anyone can add a message or a photo, no account
            required. The board stays up for as long as you want it — a keepsake, not a
            campaign.
          </p>
          <p className="mt-4 leading-relaxed text-black/75">
            {/* TODO(owner): replace with your real name and a photo before this page ships publicly — see STATUS.md */}
            Fondly Held is built and run by a solo founder in Nigeria. If you have a question,
            feedback, or a board you&apos;re proud of, reach out — a real person reads every
            message.
          </p>

          <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-4">
            {PROMISES.map(({ icon: Icon, title, body }) => (
              <li key={title} className="rounded-2xl border border-black/5 bg-white/60 p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--brand-soft)]" style={{ color: "var(--brand-ink)" }}>
                  <Icon size={18} strokeWidth={1.75} />
                </span>
                <p className="mt-3 font-heading text-[15px] leading-snug" style={{ color: "var(--brand-ink)" }}>
                  {title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-black/55">{body}</p>
              </li>
            ))}
          </ul>

          <p className="mt-8 text-sm text-black/50">
            Contact: <a href="mailto:netojaycee@gmail.com" className="underline underline-offset-2">netojaycee@gmail.com</a>
          </p>
        </div>
      </Reveal>

      <BrandPanel
        variant="card"
        tagline="Made for every occasion — including the ones that aren't easy to celebrate."
        className="rounded-[28px] p-7 sm:p-10 lg:sticky lg:top-28"
      />
    </div>
  );
}
