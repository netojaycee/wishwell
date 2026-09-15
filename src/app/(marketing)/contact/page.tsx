import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-heading text-3xl">Contact</h1>
      <p className="mt-5 leading-relaxed text-black/75">
        Question about a board, a bug to report, or feedback on Fondly Held? Email directly —
        a real person reads and answers every message.
      </p>
      <a
        href="mailto:netojaycee@gmail.com"
        className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
      >
        netojaycee@gmail.com
      </a>
    </div>
  );
}
