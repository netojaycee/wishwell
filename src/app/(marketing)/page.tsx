import Link from "next/link";
import Image from "next/image";
import { Gift, Infinity as InfinityIcon, ShieldCheck } from "lucide-react";
import { listOccasionsWithThemes } from "@/lib/data/occasions";
import { PHOTOS, showcaseFor } from "@/lib/content/moments";
import type { ThemeRow } from "@/lib/types";
import { Reveal } from "@/components/board/reveal";
import { OccasionArt } from "@/components/illustrations/occasion-art";
import { DemoBoard } from "@/components/showcase/demo-board";
import { HeroCollage } from "@/components/marketing/hero-collage";
import { BoardStepArt, CreateStepArt, ShareStepArt } from "@/components/marketing/how-it-works-art";
import { MediaMarquee } from "@/components/marketing/media-marquee";

// No metadata export here on purpose: this page's title/description were identical to
// root layout's `default` — setting them again just applies root's title template on
// top, producing a doubled "Fondly Held ... · Fondly Held". Inheriting the default
// avoids that.

export const revalidate = 3600;

const TONE_CAPTION: Record<"celebratory" | "warm" | "solemn", { name: string; caption: string }> = {
  celebratory: { name: "Celebratory", caption: "Birthdays, weddings, new babies: confetti on arrival and a little bounce." },
  warm: { name: "Warm", caption: "Farewells, thank-yous, get-wells: a soft fade-up and a slow, drifting glow." },
  solemn: { name: "Solemn", caption: "Memorials: still, quiet and unhurried. Never confetti, never a bounce." },
};

const TONE_BOARDS = ["birthday", "farewell", "memorial"];

const STEPS = [
  { step: "1", title: "Create a board", body: "Pick an occasion, add a name and a theme. Takes a minute — no account needed.", Art: CreateStepArt },
  { step: "2", title: "Share the link", body: "Send it to whoever you want — WhatsApp, email, Slack. Anyone can post, no signup.", Art: ShareStepArt },
  { step: "3", title: "Keep it forever", body: "Messages, photos and videos land on one beautiful page the recipient can revisit anytime.", Art: BoardStepArt },
];

const PROMISES = [
  { Icon: InfinityIcon, title: "Your board is yours forever", body: "No expiry dates and no archive fees. The page stays up for as long as you want it." },
  { Icon: ShieldCheck, title: "We never sell your data", body: "No ads and no data brokers. Owners can hide or delete any post, or the whole board, any time." },
  { Icon: Gift, title: "Free — every feature", body: "Photos, videos, GIFs, invites and slideshow are all free, and nobody needs an account to post." },
];

const BRAND_ART = { accent: "var(--brand)", accentSoft: "var(--brand-soft)", ink: "var(--brand-ink)" };

export default async function HomePage() {
  const occasions = await listOccasionsWithThemes();
  const themes: Record<string, ThemeRow | undefined> = Object.fromEntries(
    occasions.map((o) => [o.key, o.themes.find((t) => t.isDefault) ?? o.themes[0]]),
  );

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
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 pt-16 pb-20 sm:pt-24 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8 lg:pb-24">
          <div>
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
            <HeroCollage variant="mobile" themes={themes} />
          </div>

          {/* Card collage — shows the product itself, across a celebratory / warm / solemn
              spread, so the pitch ("every occasion") is visible rather than just claimed. */}
          <HeroCollage variant="desktop" themes={themes} />
        </div>
      </section>

      <section id="occasions" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-20">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-heading text-3xl">Pick an occasion</h2>
          <p className="text-sm text-black/50">Ten occasions, one kind of board — each with its own look and feel.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
          {occasions.map((o) => {
            const theme = themes[o.key];
            const cover = PHOTOS[showcaseFor(o.key).cover];
            return (
              <Link
                key={o.key}
                href={`/occasions/${o.key}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-3xl border border-black/5 shadow-sm transition-shadow hover:shadow-lg"
                style={{ background: theme?.palette.bg }}
              >
                <Image
                  src={cover.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 46vw"
                  className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-105"
                />
                {theme ? (
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${theme.palette.bg} 12%, color-mix(in srgb, ${theme.palette.bg} 75%, transparent) 32%, transparent 62%)`,
                    }}
                  />
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-3.5 sm:p-4">
                  <p className="font-heading text-[17px] leading-tight sm:text-lg" style={{ color: theme?.palette.ink }}>
                    {o.label}
                  </p>
                  {theme ? (
                    <OccasionArt
                      occasionKey={o.key}
                      profile={o.motionProfile}
                      palette={theme.palette}
                      animate="hover"
                      className="h-10 w-10 shrink-0 drop-shadow-sm sm:h-11 sm:w-11"
                    />
                  ) : null}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-black/5 py-16 lg:py-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(60% 50% at 50% 0%, color-mix(in srgb, var(--brand-soft) 55%, transparent), transparent)" }}
        />
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-4xl">Every tone, handled with care</h2>
            <p className="mt-3 text-black/60">
              The same board, three very different moods. Fondly Held matches the motion to the
              moment, so a memorial never feels like a party.
            </p>
          </div>
          <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-4 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-8 lg:overflow-visible lg:px-0">
            {TONE_BOARDS.map((key, i) => {
              const o = occasions.find((oc) => oc.key === key);
              const theme = themes[key];
              if (!o || !theme) return null;
              const tone = TONE_CAPTION[o.motionProfile];
              return (
                <div key={key} className="w-[84%] shrink-0 snap-center sm:w-[58%] lg:w-auto">
                  <Reveal profile={o.motionProfile} inView delay={i * 0.1}>
                    <DemoBoard
                      showcase={showcaseFor(key)}
                      theme={theme}
                      occasionKey={key}
                      occasionLabel={o.label}
                      profile={o.motionProfile}
                      tribute={o.category === "tribute"}
                    />
                    <div className="mt-5 px-1">
                      <p className="text-xs font-semibold tracking-wider uppercase" style={{ color: theme.palette.accent }}>
                        {tone.name}
                      </p>
                      <p className="mt-1 text-sm text-black/60">{tone.caption}</p>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-black/5 bg-[var(--brand-soft)]/30">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
          <h2 className="font-heading text-3xl">How it works</h2>
          <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-8">
            {STEPS.map(({ step, title, body, Art }, i) => (
              <Reveal key={step} profile="warm" inView delay={i * 0.1}>
                <div className="flex h-56 items-center justify-center overflow-hidden rounded-3xl border border-black/5 bg-white/60">
                  <Art />
                </div>
                <div className="mt-5 flex items-baseline gap-3">
                  <span className="font-heading text-3xl" style={{ color: "var(--brand)" }}>
                    {step}
                  </span>
                  <h3 className="font-medium">{title}</h3>
                </div>
                <p className="mt-1 text-sm text-black/60">{body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-heading text-3xl sm:text-4xl">Messages, photos, videos and GIFs</h2>
          <p className="mt-3 max-w-xl text-black/60">
            Whatever people want to say lands on one page — in their own words, their own
            photos, and the occasional very silly GIF.
          </p>
        </div>
        <div className="mt-6">
          <MediaMarquee themes={themes} />
        </div>
      </section>

      <section className="border-y border-black/5 bg-white/50">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3 sm:gap-10">
          {PROMISES.map(({ Icon, title, body }) => (
            <div key={title} className="flex gap-4">
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
                style={{ background: "var(--brand-soft)", color: "var(--brand-ink)" }}
              >
                <Icon size={20} strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-heading text-lg leading-snug">{title}</h3>
                <p className="mt-1 text-sm text-black/60">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="px-6 py-16 lg:py-20">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] px-6 py-14 sm:px-12 sm:py-16" style={{ background: "var(--brand-ink)" }}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 60% at 12% 15%, color-mix(in srgb, var(--brand) 45%, transparent), transparent), radial-gradient(50% 50% at 92% 92%, color-mix(in srgb, var(--brand-soft) 20%, transparent), transparent)",
            }}
          />
          <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto]">
            <div className="text-center lg:text-left">
              <h2 className="mx-auto max-w-lg font-heading text-3xl leading-tight text-white sm:text-5xl lg:mx-0">
                Gather everyone&apos;s words, for whoever needs them.
              </h2>
              <p className="mx-auto mt-4 max-w-md text-white/70 lg:mx-0">
                It takes a minute to start. Free, with no account needed for anyone who posts.
              </p>
              <Link
                href="/create"
                className="mt-8 inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold transition-transform hover:scale-[1.03]"
                style={{ color: "var(--brand-ink)" }}
              >
                Create a free board
              </Link>
            </div>

            <div className="relative mx-auto h-56 w-64 sm:w-72" aria-hidden>
              {[
                { photo: PHOTOS.weddingEmbrace, cls: "left-0 top-2", rotate: -6 },
                { photo: PHOTOS.babyFeet, cls: "right-0 top-10", rotate: 5 },
              ].map(({ photo, cls, rotate }) => (
                <div
                  key={photo.src}
                  className={`absolute w-36 rounded-md bg-white p-2 pb-6 shadow-2xl sm:w-40 ${cls}`}
                  style={{ transform: `rotate(${rotate}deg)` }}
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-sm">
                    <Image src={photo.src} alt="" fill sizes="160px" className="object-cover" />
                  </div>
                </div>
              ))}
              <OccasionArt
                occasionKey="thank-you"
                profile="warm"
                palette={BRAND_ART}
                className="absolute -bottom-2 left-1/2 h-20 w-20 -translate-x-1/2 drop-shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
