import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { listBoardsForOwner } from "@/lib/data/boards";
import { ClaimBoards } from "@/components/dashboard/claim-boards";

export const metadata: Metadata = { title: "My boards" };

export default async function DashboardPage() {
  const session = await getSession();
  const boards = session ? await listBoardsForOwner(session.user.id) : [];

  return (
    <div>
      <ClaimBoards ownerId={session!.user.id} />
      <h1 className="font-heading text-3xl">My boards</h1>

      {boards.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-black/15 px-6 py-16 text-center">
          <p className="text-black/60">You haven&apos;t created a board yet.</p>
          <Link
            href="/create"
            className="mt-4 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            Create your first board
          </Link>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {boards.map((board) => (
            <li key={board.id} className="overflow-hidden rounded-2xl border border-black/10">
              <div className="flex h-20 items-end p-4" style={{ background: board.theme.palette.bg }}>
                <span
                  className="rounded-full px-2 py-1 text-[11px] font-medium"
                  style={{ background: board.theme.palette.accentSoft, color: board.theme.palette.accent }}
                >
                  {board.occasionType.label}
                </span>
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
          ))}
        </ul>
      )}
    </div>
  );
}
