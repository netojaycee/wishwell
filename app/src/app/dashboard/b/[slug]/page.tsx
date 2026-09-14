import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getBoardBySlug } from "@/lib/data/boards";
import { listAllPostsForModeration } from "@/lib/data/posts";
import { ModerationList } from "@/components/dashboard/moderation-list";
import { BoardSettingsForm } from "@/components/dashboard/board-settings-form";
import { InviteForm } from "@/components/dashboard/invite-form";

type Params = { params: Promise<{ slug: string }> };

export const metadata: Metadata = { title: "Manage board" };

export default async function ManageBoardPage({ params }: Params) {
  const { slug } = await params;
  const session = await getSession();
  const board = await getBoardBySlug(slug);

  if (!board || !session || board.ownerId !== session.user.id) notFound();

  const posts = await listAllPostsForModeration(board.id);

  return (
    <div>
      <Link href="/dashboard" className="text-sm text-black/50 hover:text-black">
        ← My boards
      </Link>
      <h1 className="mt-2 font-heading text-3xl">{board.title}</h1>
      <Link href={`/b/${board.slug}`} className="text-sm underline underline-offset-2">
        View the live board
      </Link>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-heading text-xl">Posts ({posts.length})</h2>
          <ModerationList posts={posts} slug={board.slug} />
        </div>

        <div className="space-y-8">
          <BoardSettingsForm board={board} />
          <InviteForm slug={board.slug} />
        </div>
      </div>
    </div>
  );
}
