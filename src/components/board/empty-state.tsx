import Link from "next/link";
import { Reveal } from "./reveal";

export function EmptyState({
  slug,
  mode,
  profile,
}: {
  slug: string;
  mode: "collaborative" | "tribute";
  profile: "celebratory" | "warm" | "solemn";
}) {
  return (
    <Reveal profile={profile} inView>
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <div
          className="mx-auto mb-6 h-16 w-16 rounded-full"
          style={{ background: "var(--board-accent-soft)" }}
        />
        <h2
          className="text-2xl"
          style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
        >
          {mode === "tribute" ? "Be the first to share a memory" : "Be the first to sign this board"}
        </h2>
        <p className="mt-3 text-[var(--board-ink)]/70">
          {mode === "tribute"
            ? "A memory, a photo, a few words — it means more than you know."
            : "Add a message, a photo, or a video. It takes a minute and it stays here forever."}
        </p>
        <Link
          href={`/b/${slug}/post`}
          className="mt-6 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ background: "var(--board-accent)" }}
        >
          {mode === "tribute" ? "Share a memory" : "Add your message"}
        </Link>
      </div>
    </Reveal>
  );
}
