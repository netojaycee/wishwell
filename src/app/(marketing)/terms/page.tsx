import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-black/50">Last updated: September 2026</p>

      <p className="mt-6 leading-relaxed text-black/75">
        By creating a board or posting to one, you agree to these terms.
        {/* TODO(owner): have this reviewed by a lawyer before commercial launch */}
      </p>

      <h2 className="mt-8 font-heading text-xl">Your content</h2>
      <p className="mt-3 text-sm text-black/70">
        You keep ownership of anything you post. By posting, you give Fondly Held permission
        to store and display it as part of the board you&apos;re posting to. You&apos;re responsible
        for having the right to share anything you post, photos, videos, and messages,
        including getting consent from anyone identifiable in them where appropriate.
      </p>

      <h2 className="mt-8 font-heading text-xl">What&apos;s not allowed</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Illegal content, harassment, hate speech, or content that impersonates someone without consent.</li>
        <li>Spam, scraping, or automated posting outside the normal contribution flow.</li>
        <li>Uploading media you don&apos;t have the right to share.</li>
      </ul>
      <p className="mt-3 text-sm text-black/70">
        Board owners can remove any post at any time, and we may remove content or suspend
        an account that violates these terms.
      </p>

      <h2 className="mt-8 font-heading text-xl">Boards and moderation</h2>
      <p className="mt-3 text-sm text-black/70">
        The person who creates a board is responsible for moderating it. Fondly Held provides
        the tools to hide, delete, and report posts, but doesn&apos;t pre-review content before
        it&apos;s published.
      </p>

      <h2 className="mt-8 font-heading text-xl">Availability</h2>
      <p className="mt-3 text-sm text-black/70">
        Fondly Held is provided as-is. We aim to keep boards available indefinitely, but can&apos;t
        guarantee uninterrupted service. We&apos;ll do our best to give notice before any change
        that affects existing boards.
      </p>

      <h2 className="mt-8 font-heading text-xl">Contact</h2>
      <p className="mt-3 text-sm text-black/70">
        Questions about these terms:{" "}
        <a href="mailto:netojaycee@gmail.com" className="underline">netojaycee@gmail.com</a>
      </p>
    </div>
  );
}
