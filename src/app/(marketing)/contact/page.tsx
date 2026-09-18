import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { BrandPanel } from "@/components/brand/brand-panel";
import { Reveal } from "@/components/board/reveal";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center lg:gap-16 lg:py-20">
      <Reveal profile="warm">
        <div className="max-w-xl">
          <p className="text-xs font-medium tracking-wide text-black/40 uppercase">Contact</p>
          <h1 className="mt-3 font-heading text-4xl leading-tight sm:text-5xl" style={{ color: "var(--brand-ink)" }}>
            Talk to a real person
          </h1>
          <p className="mt-6 leading-relaxed text-black/75">
            Question about a board, a bug to report, or feedback on Fondly Held? Email directly and
            a real person reads and answers every message.
          </p>
          <p className="mt-4 leading-relaxed text-black/75">
            If it&apos;s about a specific board, include its link so we can find it quickly.
          </p>
          <a
            href="mailto:netojaycee@gmail.com"
            className="mt-8 inline-flex items-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
            style={{ background: "var(--brand-ink)" }}
          >
            <Mail size={16} strokeWidth={2} />
            netojaycee@gmail.com
          </a>
        </div>
      </Reveal>

      <BrandPanel
        variant="card"
        tagline="A real person reads every message, no support bot in between."
        className="rounded-[28px] p-7 sm:p-10"
      />
    </div>
  );
}
