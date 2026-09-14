import Image from "next/image";
import Link from "next/link";
import { Reveal } from "./reveal";
import { LiveCounter } from "./live-counter";
import type { BoardWithRelations } from "@/lib/types";

export function BoardHero({ board, postCount }: { board: BoardWithRelations; postCount: number }) {
  const profile = board.occasionType.motionProfile;

  return (
    <header className="relative overflow-hidden">
      {board.coverImageUrl ? (
        <div className="absolute inset-0 -z-10">
          <Image
            src={board.coverImageUrl}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[var(--board-bg)]/70" />
        </div>
      ) : null}

      <div className="mx-auto max-w-3xl px-6 pt-20 pb-14 text-center sm:pt-28 sm:pb-20">
        <Reveal profile={profile}>
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase"
            style={{ background: "var(--board-accent-soft)", color: "var(--board-accent)" }}
          >
            {board.occasionType.label}
          </span>
        </Reveal>

        <Reveal profile={profile} delay={0.08}>
          <h1
            className="mt-6 text-4xl leading-tight sm:text-6xl"
            style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
          >
            {board.title}
          </h1>
        </Reveal>

        {board.headline ? (
          <Reveal profile={profile} delay={0.16}>
            <p className="mt-4 text-lg text-[var(--board-ink)]/70">{board.headline}</p>
          </Reveal>
        ) : null}

        <Reveal profile={profile} delay={0.24}>
          <div className="mt-8 flex flex-col items-center gap-4">
            <Link
              href={`/b/${board.slug}/post`}
              className="rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "var(--board-accent)" }}
            >
              {board.mode === "tribute" ? "Share a memory" : "Add your message"}
            </Link>
            <LiveCounter
              count={postCount}
              label={
                board.mode === "tribute"
                  ? postCount === 1
                    ? "person has shared a memory"
                    : "people have shared a memory"
                  : postCount === 1
                    ? "message so far"
                    : "messages so far"
              }
            />
          </div>
        </Reveal>
      </div>
    </header>
  );
}
