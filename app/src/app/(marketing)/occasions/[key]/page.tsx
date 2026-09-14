import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listOccasionTypes, getOccasionByKey } from "@/lib/data/occasions";
import { listRecentPublicBoardsForOccasion } from "@/lib/data/boards";
import { occasionCopy } from "@/lib/content/occasion-copy";

export const revalidate = 3600;

type Params = { params: Promise<{ key: string }> };

export async function generateStaticParams() {
  const occasions = await listOccasionTypes();
  return occasions.map((o) => ({ key: o.key }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { key } = await params;
  const occasion = await getOccasionByKey(key);
  if (!occasion) return {};
  return {
    title: occasion.seoTitle,
    description: occasion.seoDescription,
    alternates: { canonical: `/occasions/${occasion.key}` },
  };
}

export default async function OccasionLandingPage({ params }: Params) {
  const { key } = await params;
  const occasion = await getOccasionByKey(key);
  if (!occasion) notFound();

  const copy = occasionCopy[occasion.key];
  const recentBoards = await listRecentPublicBoardsForOccasion(occasion.id, 3);

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

  return (
    <div>
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <section className="mx-auto max-w-3xl px-6 pt-16 pb-10 text-center">
        <p className="text-xs font-medium tracking-wide text-black/40 uppercase">{occasion.category}</p>
        <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl">{occasion.seoTitle.split(" — ")[0] ?? occasion.label}</h1>
        <p className="mx-auto mt-4 max-w-xl text-black/60">{occasion.seoDescription}</p>
        <Link
          href={`/create?occasion=${occasion.key}`}
          className="mt-7 inline-flex rounded-full bg-black px-7 py-3 text-sm font-semibold text-white"
        >
          {occasion.ctaText}
        </Link>
      </section>

      {copy ? (
        <section className="mx-auto max-w-2xl px-6 py-10">
          {copy.intro.map((p, i) => (
            <p key={i} className="mt-4 leading-relaxed text-black/75 first:mt-0">
              {p}
            </p>
          ))}

          <h2 className="mt-10 font-heading text-xl">What to write</h2>
          <ul className="mt-3 space-y-2">
            {copy.tips.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-black/70">
                <span className="text-black/30">—</span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {recentBoards.length > 0 ? (
        <section className="border-t border-black/5 bg-neutral-50">
          <div className="mx-auto max-w-4xl px-6 py-12">
            <h2 className="font-heading text-xl">Recent {occasion.label.toLowerCase()} boards</h2>
            <ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {recentBoards.map((b) => (
                <li key={b.id}>
                  <Link
                    href={`/b/${b.slug}`}
                    className="block rounded-xl border border-black/10 bg-white p-4 text-sm font-medium hover:shadow-sm"
                  >
                    {b.title}
                    <span className="mt-1 block text-xs font-normal text-black/40">for {b.recipientName}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      {copy ? (
        <section className="mx-auto max-w-2xl px-6 py-14">
          <h2 className="font-heading text-xl">Frequently asked questions</h2>
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

      <section className="border-t border-black/5 px-6 py-14 text-center">
        <Link
          href={`/create?occasion=${occasion.key}`}
          className="inline-flex rounded-full bg-black px-7 py-3 text-sm font-semibold text-white"
        >
          {occasion.ctaText}
        </Link>
      </section>
    </div>
  );
}
