import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listOccasionTypes, getOccasionByKey, getThemesForOccasion } from "@/lib/data/occasions";
import { listRecentPublicBoardsForOccasion } from "@/lib/data/boards";
import { occasionCopy } from "@/lib/content/occasion-copy";
import { showcaseFor } from "@/lib/content/moments";
import { boardThemeVars } from "@/lib/theme/vars";
import { Reveal } from "@/components/board/reveal";
import { OccasionArt } from "@/components/illustrations/occasion-art";
import { DemoBoard } from "@/components/showcase/demo-board";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 3600;

type Params = { params: Promise<{ key: string }> };

// Deterministic tiny tilt per index so the tip cards read handwritten, with no
// server/client mismatch.
const TIP_ROTATIONS = [-1.4, 1, -0.6, 1.3, -1];

export async function generateStaticParams() {
  const occasions = await listOccasionTypes();
  return occasions.map((o) => ({ key: o.key }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { key } = await params;
  const occasion = await getOccasionByKey(key);
  if (!occasion) return {};
  return {
    // seoTitle already ends in "| Fondly Held", absolute skips the root "%s · Fondly Held"
    // template, which otherwise doubled the brand in the tab/SERP title.
    title: { absolute: occasion.seoTitle },
    description: occasion.seoDescription,
    alternates: { canonical: `/occasions/${occasion.key}` },
  };
}

export default async function OccasionLandingPage({ params }: Params) {
  const { key } = await params;
  const occasion = await getOccasionByKey(key);
  if (!occasion) notFound();

  const copy = occasionCopy[occasion.key];
  const [recentBoards, themes] = await Promise.all([
    listRecentPublicBoardsForOccasion(occasion.id, 3),
    getThemesForOccasion(occasion.id),
  ]);
  const theme = themes.find((t) => t.isDefault) ?? themes[0];
  const profile = occasion.motionProfile;
  const showcase = showcaseFor(occasion.key, profile);
  const palette = theme?.palette;

  const faqJsonLd = copy
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: copy.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;

  // GROWTH.md technical SEO checklist: BreadcrumbList JSON-LD (Home › occasion page).
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Fondly Held", item: `${appUrl}/` },
      { "@type": "ListItem", position: 2, name: occasion.label, item: `${appUrl}/occasions/${occasion.key}` },
    ],
  };

  const cta = (
    <Link
      href={`/create?occasion=${occasion.key}`}
      className="inline-flex rounded-full px-7 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:scale-100"
      style={{ background: "var(--board-accent, var(--brand-ink))" }}
    >
      {occasion.ctaText}
    </Link>
  );

  return (
    <div style={theme ? boardThemeVars(theme) : undefined}>
      <JsonLd data={breadcrumbJsonLd} />
      {faqJsonLd ? (
        <JsonLd data={faqJsonLd} />
      ) : null}

      <section className="relative overflow-hidden">
        {palette ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background: `radial-gradient(55% 50% at 12% 10%, ${palette.accentSoft}, transparent), radial-gradient(45% 45% at 92% 30%, ${palette.accentSoft}, transparent)`,
              opacity: 0.8,
            }}
          />
        ) : null}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pt-14 pb-16 sm:pt-20 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-14 lg:pb-24">
          <Reveal profile={profile}>
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                {palette ? (
                  <OccasionArt occasionKey={occasion.key} profile={profile} palette={palette} className="h-12 w-12 shrink-0" />
                ) : null}
                <p className="text-xs font-medium tracking-wide uppercase" style={{ color: "var(--board-accent, rgba(0,0,0,0.4))" }}>
                  {occasion.category}
                </p>
              </div>
              <h1 className="mt-4 font-heading text-4xl leading-tight sm:text-5xl" style={{ color: "var(--board-ink)" }}>
                {occasion.seoTitle.split(/, | \| /)[0] || occasion.label}
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-black/60 lg:mx-0">{occasion.seoDescription}</p>
              <div className="mt-7">{cta}</div>
              <p className="mt-3 text-xs text-black/40">Free · no account needed to contribute</p>
            </div>
          </Reveal>

          {theme ? (
            <Reveal profile={profile} delay={0.15} className="mx-auto w-full max-w-[400px] lg:max-w-none">
              <DemoBoard
                showcase={showcase}
                theme={theme}
                occasionKey={occasion.key}
                occasionLabel={occasion.label}
                profile={profile}
                tribute={occasion.category === "tribute"}
                preload
              />
              <p className="mt-3 text-center text-[11px] text-black/35">An example board, yours fills up with real messages.</p>
            </Reveal>
          ) : null}
        </div>
      </section>

      {copy ? (
        <section className="mx-auto max-w-2xl px-6 py-10">
          {copy.intro.map((p, i) => (
            <p key={i} className="mt-4 leading-relaxed text-black/75 first:mt-0">
              {p}
            </p>
          ))}

          <h2 className="mt-12 font-heading text-2xl">What to write</h2>
          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {copy.tips.map((tip, i) => (
              <li key={i}>
                <Reveal profile={profile} inView delay={i * 0.06}>
                  <div
                    className="h-full rounded-2xl border p-5 shadow-sm"
                    style={{
                      background: "var(--board-accent-soft, #f5f5f5)",
                      borderColor: "color-mix(in srgb, var(--board-ink, #000) 8%, transparent)",
                      transform: `rotate(${TIP_ROTATIONS[i % TIP_ROTATIONS.length]}deg)`,
                    }}
                  >
                    <span
                      className="font-heading text-2xl leading-none"
                      style={{ color: "var(--board-accent)" }}
                      aria-hidden
                    >
                      “
                    </span>
                    <p
                      className="mt-1 text-[17px] leading-snug"
                      style={{ fontFamily: "var(--board-font-heading, var(--font-fraunces))", color: "var(--board-ink)" }}
                    >
                      {tip}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recentBoards.length > 0 && palette ? (
        <section className="border-t border-black/5" style={{ background: "color-mix(in srgb, var(--board-accent-soft) 35%, transparent)" }}>
          <div className="mx-auto max-w-4xl px-6 py-14">
            <h2 className="font-heading text-2xl">Recent {occasion.label.toLowerCase()} boards</h2>
            <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {recentBoards.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/b/${b.slug}`}
                    className="group flex h-full items-center gap-3 rounded-2xl border p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                    style={{ background: "var(--board-bg)", borderColor: "color-mix(in srgb, var(--board-ink) 10%, transparent)" }}
                  >
                    <OccasionArt occasionKey={occasion.key} profile={profile} palette={palette} animate="hover" className="h-12 w-12 shrink-0" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium" style={{ color: "var(--board-ink)" }}>
                        {b.title}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-black/45">for {b.recipientName}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {copy ? (
        <section className="mx-auto max-w-2xl px-6 py-14">
          <h2 className="font-heading text-2xl">Frequently asked questions</h2>
          <dl className="mt-5 space-y-6">
            {copy.faqs.map((f) => (
              <div key={f.q}>
                <dt className="font-medium">{f.q}</dt>
                <dd className="mt-1 text-sm text-black/60">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      ) : null}

      <section className="border-t border-black/5 px-6 py-16 text-center">
        {palette ? (
          <OccasionArt occasionKey={occasion.key} profile={profile} palette={palette} className="mx-auto mb-5 h-20 w-20" />
        ) : null}
        <p className="mx-auto mb-6 max-w-md font-heading text-2xl" style={{ color: "var(--board-ink)" }}>
          One link. Everyone adds something. {occasion.category === "tribute" ? "A place to remember, together." : "They keep it forever."}
        </p>
        {cta}
      </section>
    </div>
  );
}
