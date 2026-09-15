import type { Metadata } from "next";
import { SplitShell } from "@/components/brand/split-shell";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <SplitShell tagline="A real person reads every message — no support bot in between.">
      <h1 className="font-heading text-3xl" style={{ color: "var(--brand-ink)" }}>
        Contact
      </h1>
      <p className="mt-5 leading-relaxed text-black/75">
        Question about a board, a bug to report, or feedback on Fondly Held? Email directly —
        a real person reads and answers every message.
      </p>
      <a
        href="mailto:netojaycee@gmail.com"
        className="mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white"
        style={{ background: "var(--brand-ink)" }}
      >
        netojaycee@gmail.com
      </a>
    </SplitShell>
  );
}
