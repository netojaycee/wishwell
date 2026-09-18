import type { Metadata } from "next";
import Image from "next/image";
import { Gift, Infinity as InfinityIcon, ShieldCheck } from "lucide-react";
import { BrandPanel } from "@/components/brand/brand-panel";
import { Reveal } from "@/components/board/reveal";
import { BRAND } from "@/lib/brand";

export const metadata: Metadata = {
  title: "About",
  description: `${BRAND.name} is built and run by ${BRAND.founder.name}, a solo founder in Nigeria. Beautiful group cards and tribute pages for every occasion, free.`,
  alternates: { canonical: "/about" },
};

// Founder as a schema.org Person linked to the Organization in the root layout, a named,
// real human behind the product (GROWTH.md §3 trust), readable by search engines too.
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${appUrl}/about#founder`,
  name: BRAND.founder.name,
  jobTitle: BRAND.founder.jobTitle,
  image: `${appUrl}${BRAND.founder.image}`,
  email: `mailto:${BRAND.email}`,
  url: `${appUrl}/about`,
  homeLocation: { "@type": "Country", name: BRAND.founder.country },
  worksFor: { "@id": `${appUrl}/#organization` },
};

const PROMISES = [
  { icon: InfinityIcon, title: "Your board is yours forever", body: "No expiry dates and no archive fees." },
  { icon: ShieldCheck, title: "We never sell your data", body: "No ads, no data brokers. Delete anything, any time." },
  { icon: Gift, title: "Free, every feature", body: "And nobody needs an account to post." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-start lg:gap-16 lg:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <Reveal profile="warm">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-wide text-black/40 uppercase">About</p>
          <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl" style={{ color: "var(--brand-ink)" }}>
            About Fondly Held
          </h1>
          <p className="mt-6 leading-relaxed text-black/75">
            Fondly Held exists because the two products that already do this well have picked
            opposite lanes, one built for corporate celebrations, the other for grief, and
            neither is particularly beautiful. Most of life&apos;s occasions don&apos;t sort neatly into
            either box. Fondly Held is built to hold all of them: birthdays, farewells, weddings,
            memorials, and everything in between, in one product that takes the design
            seriously.
          </p>
          <p className="mt-4 leading-relaxed text-black/75">
            The idea is simple: one link, anyone can add a message or a photo, no account
            required. The board stays up for as long as you want it, a keepsake, not a
            campaign.
          </p>
          <p className="mt-4 leading-relaxed text-black/75">
            Fondly Held is built and run by John Chinonso Edeh, a solo founder in Nigeria. If
            you have a question, feedback, or a board you&apos;re proud of, reach out. I read and
            answer every message myself.
          </p>

          {/* GROWTH.md §3 trust: a named human with a photo and a real email. */}
          <figure className="mt-8 flex items-center gap-5 rounded-3xl border border-black/5 bg-white/60 p-4 sm:p-5">
            <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-2xl shadow-sm">
              <Image
                src="/images/founder.webp"
                alt="John Chinonso Edeh, founder of Fondly Held"
                fill
                sizes="96px"
                className="object-cover object-[50%_25%]"
              />
            </div>
            <figcaption>
              <p className="font-heading text-xl leading-tight" style={{ color: "var(--brand-ink)" }}>
                John Chinonso Edeh
              </p>
              <p className="mt-0.5 text-sm text-black/55">Founder, Fondly Held · Nigeria</p>
              <a href="mailto:netojaycee@gmail.com" className="mt-2 inline-block text-sm underline underline-offset-2">
                netojaycee@gmail.com
              </a>
            </figcaption>
          </figure>

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
        </div>
      </Reveal>

      <BrandPanel
        variant="card"
        tagline="Made for every occasion, including the ones that aren't easy to celebrate."
        className="rounded-[28px] p-7 sm:p-10 lg:sticky lg:top-28"
      />
    </div>
  );
}
