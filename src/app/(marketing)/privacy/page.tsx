import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-black/50">Last updated: September 2026</p>

      <p className="mt-6 leading-relaxed text-black/75">
        This policy explains what Fondly Held collects, why, and what you can do about it.
        {/* TODO(owner): have this reviewed by a lawyer before commercial launch */}
      </p>

      <h2 className="mt-8 font-heading text-xl">What we collect</h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-black/70">
        <li>Account info for board owners: name, email, and an encrypted password (or your Google account, if you sign in that way).</li>
        <li>Board content: whatever you and your contributors post, names, messages, photos, and videos.</li>
        <li>A hashed (not raw) IP address on each anonymous post or report, used only to enforce rate limits and reduce spam.</li>
        <li>
          Basic usage analytics, page views (Vercel Web Analytics) and whether key steps like
          creating a board or posting succeed (PostHog), to understand what&apos;s working. These
          never include the content of messages, names, or photos, and we don&apos;t record sessions.
        </li>
      </ul>

      <h2 className="mt-8 font-heading text-xl">What we don&apos;t do</h2>
      <p className="mt-3 text-sm text-black/70">
        We never sell your data or a board&apos;s content to third parties. We don&apos;t show ads on
        boards. We don&apos;t use board content to train AI models.
      </p>

      <h2 className="mt-8 font-heading text-xl">Who we share it with</h2>
      <p className="mt-3 text-sm text-black/70">
        We use a small number of infrastructure providers to run the service: a database
        host, an object storage provider for media, and an email provider for invitations.
        Each only receives the data it needs to do its job, and none of them are permitted
        to use it for their own purposes.
      </p>

      <h2 className="mt-8 font-heading text-xl">Your choices</h2>
      <p className="mt-3 text-sm text-black/70">
        Board owners can hide or delete any post at any time, deleting a post also deletes
        its media from storage, not just the visible entry. You can delete your account and
        its boards by contacting us. Anyone can report a post they believe shouldn&apos;t be
        there.
      </p>

      <h2 className="mt-8 font-heading text-xl">Contact</h2>
      <p className="mt-3 text-sm text-black/70">
        Questions about this policy or a request to delete your data:{" "}
        <a href="mailto:netojaycee@gmail.com" className="underline">netojaycee@gmail.com</a>
      </p>
    </div>
  );
}
