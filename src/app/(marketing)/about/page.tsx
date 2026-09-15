import type { Metadata } from "next";

export const metadata: Metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl">About Fondly Held</h1>
      <p className="mt-5 leading-relaxed text-black/75">
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
      <p className="mt-6 text-sm text-black/50">
        Contact: <a href="mailto:netojaycee@gmail.com" className="underline">netojaycee@gmail.com</a>
      </p>
    </div>
  );
}
