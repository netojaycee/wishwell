import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { listBoardsForOwner } from "@/lib/data/boards";
import { ClaimBoards } from "@/components/dashboard/claim-boards";
import { OccasionArt } from "@/components/illustrations/occasion-art";

export const metadata: Metadata = { title: "My boards" };

const BRAND_PALETTE = { accent: "#c4713f", accentSoft: "#f2e4bc", ink: "#241c0a" };

export default async function DashboardPage() {
  const session = await getSession();
  const boards = session ? await listBoardsForOwner(session.user.id) : [];

  return (
    <div>
      <ClaimBoards ownerId={session!.user.id} />
      <h1 className="font-heading text-3xl">My boards</h1>

      {boards.length === 0 ? (
        <div className="mt-10 overflow-hidden rounded-3xl border border-black/5 bg-white/70 px-6 py-14 text-center shadow-sm">
          {/* Ghost cards fanned behind the illustration — a hint of the board to come. */}
          <div aria-hidden className="relative mx-auto h-36 w-60">
            {[
              { rotate: -10, x: "-46%", bg: "#FFE1C4" },
              { rotate: 8, x: "46%", bg: "#DCE8D6" },
            ].map((g, i) => (
              <span
                key={i}
                className="absolute top-6 left-1/2 h-24 w-20 rounded-xl border border-black/5 shadow-sm"
                style={{ background: g.bg, transform: `translateX(calc(-50% + ${g.x})) rotate(${g.rotate}deg)` }}
              />
            ))}
            <OccasionArt
              occasionKey="letter"
              profile="warm"
              palette={BRAND_PALETTE}
              className="absolute top-0 left-1/2 h-32 w-32 -translate-x-1/2"
            />
          </div>
          <h2 className="mt-6 font-heading text-2xl" style={{ color: "var(--brand-ink)" }}>
            Your boards will live here
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-black/60">
            Start one for someone — a birthday, a farewell, a memory worth keeping. It takes
            about a minute, and nobody needs an account to post.
          </p>
          <Link
            href="/create"
            className="mt-6 inline-flex rounded-full bg-[var(--brand-ink)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand)]"
          >
            Create your first board
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {boards.map((board) => {
            const palette = board.theme.palette;
            return (
              <li
                key={board.id}
                className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="relative flex h-28 items-end justify-between overflow-hidden p-4" style={{ background: palette.bg }}>
                  {board.coverImageUrl ? (
                    <>
                      <Image src={board.coverImageUrl} alt="" fill sizes="(min-width: 640px) 440px, 100vw" className="object-cover" />
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(90deg, ${palette.bg} 30%, transparent)` }}
                      />
                    </>
                  ) : null}
                  <span
                    className="relative rounded-full px-2 py-1 text-[11px] font-medium"
                    style={{ background: palette.accentSoft, color: palette.accent }}
                  >
                    {board.occasionType.label}
                  </span>
                  <OccasionArt
                    occasionKey={board.occasionType.key}
                    profile={board.occasionType.motionProfile}
                    palette={palette}
                    animate="hover"
                    className="relative -mb-1 h-20 w-20"
                  />
                </div>
                <div className="p-4">
                  <p className="font-medium">{board.title}</p>
                  <p className="text-sm text-black/50">
                    {board.postCount} {board.postCount === 1 ? "post" : "posts"} · {board.status}
                  </p>
                  <div className="mt-3 flex gap-3 text-sm">
                    <Link href={`/dashboard/b/${board.slug}`} className="font-medium underline underline-offset-2">
                      Manage
                    </Link>
                    <Link href={`/b/${board.slug}`} className="text-black/50 underline underline-offset-2">
                      View
                    </Link>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
