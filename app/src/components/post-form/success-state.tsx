"use client";

// DESIGN.md signature moment #5 + GROWTH.md's highest-leverage growth surface: the
// success-state CTA. Never shown with growth-hacky copy on solemn boards.
import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/board/reveal";
import { ConfettiBurst } from "@/components/board/confetti-burst";

export function SuccessState({
  boardSlug,
  boardTitle,
  motionProfile,
  accent,
  accentSoft,
}: {
  boardSlug: string;
  boardTitle: string;
  motionProfile: "celebratory" | "warm" | "solemn";
  accent: string;
  accentSoft: string;
}) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/b/${boardSlug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      {motionProfile === "celebratory" ? <ConfettiBurst accent={accent} accentSoft={accentSoft} /> : null}
      <Reveal profile={motionProfile}>
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white"
          style={{ background: accent }}
        >
          ✓
        </div>
        <h1 className="text-2xl" style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}>
          Your message is on the board
        </h1>
        <p className="mt-3 text-[var(--board-ink)]/70">Thank you for taking the time to add something to {boardTitle}.</p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href={`/b/${boardSlug}`}
            className="rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: accent }}
          >
            View the board
          </Link>
          <button
            onClick={copyLink}
            className="text-sm font-medium underline underline-offset-2"
            style={{ color: "var(--board-ink)" }}
          >
            {copied ? "Link copied" : "Copy the board link to share"}
          </button>
        </div>

        <div className="mt-10 border-t border-[var(--board-ink)]/10 pt-6">
          <p className="text-sm text-[var(--board-ink)]/60">
            Want a board like this for someone in your life?
          </p>
          <Link href="/create" className="mt-2 inline-block text-sm font-semibold underline underline-offset-2">
            Create your own free board
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
