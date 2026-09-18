"use client";

// DESIGN.md signature moment #5 + GROWTH.md's highest-leverage growth surface: the
// success-state CTA. Never shown with growth-hacky copy on solemn boards, solemn gets
// a still illustration, calm copy, and no "create your own" nudge at all.
import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/board/reveal";
import { ConfettiBurst } from "@/components/board/confetti-burst";
import { OccasionArt } from "@/components/illustrations/occasion-art";
import { track } from "@/lib/analytics";

export function SuccessState({
  boardSlug,
  boardTitle,
  motionProfile,
  accent,
  accentSoft,
  ink,
  surface,
  occasionKey,
}: {
  boardSlug: string;
  boardTitle: string;
  motionProfile: "celebratory" | "warm" | "solemn";
  accent: string;
  accentSoft: string;
  ink: string;
  surface: string;
  occasionKey: string;
}) {
  const [copied, setCopied] = useState(false);
  const solemn = motionProfile === "solemn";

  const copyLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/b/${boardSlug}`);
    setCopied(true);
    track("board_link_shared", { via: "contributor_copy" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-md px-6 py-20 text-center">
      {motionProfile === "celebratory" ? <ConfettiBurst accent={accent} accentSoft={accentSoft} /> : null}
      <Reveal profile={motionProfile}>
        <div className="relative mx-auto mb-6 h-32 w-32">
          <OccasionArt
            occasionKey={occasionKey}
            profile={motionProfile}
            palette={{ accent, accentSoft, ink, surface }}
            className="h-full w-full"
          />
          <span
            className="absolute right-0 bottom-1 flex h-9 w-9 items-center justify-center rounded-full border-4 text-sm font-semibold text-white"
            style={{ background: accent, borderColor: "var(--board-bg)" }}
            aria-hidden
          >
            ✓
          </span>
        </div>
        <h1 className="text-2xl" style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}>
          {solemn ? "Your words are on the page" : "Your message is on the board"}
        </h1>
        <p className="mt-3 text-[var(--board-ink)]/70">
          {solemn
            ? "Thank you for sharing. They'll stay here for the family to return to, whenever they need them."
            : `Thank you for taking the time to add something to ${boardTitle}.`}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            href={`/b/${boardSlug}`}
            className="rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: accent }}
          >
            {solemn ? "Return to the page" : "View the board"}
          </Link>
          <button
            onClick={copyLink}
            className="text-sm font-medium underline underline-offset-2"
            style={{ color: "var(--board-ink)" }}
          >
            {copied ? "Link copied" : solemn ? "Copy the link for someone who'd want to add a memory" : "Copy the board link to share"}
          </button>
        </div>

        {solemn ? null : (
          <div className="mt-10 border-t border-[var(--board-ink)]/10 pt-6">
            <p className="text-sm text-[var(--board-ink)]/60">
              Want a board like this for someone in your life?
            </p>
            <Link
              href="/create"
              onClick={() => track("create_cta_from_post")}
              className="mt-2 inline-block text-sm font-semibold underline underline-offset-2"
            >
              Create your own free board
            </Link>
          </div>
        )}
      </Reveal>
    </div>
  );
}
