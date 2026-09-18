import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBoardBySlug } from "@/lib/data/boards";
import { canViewBoard } from "@/lib/access";
import { PrivateBoardNotice } from "@/components/board/private-board-notice";
import { boardThemeVars } from "@/lib/theme/vars";
import { hasR2, hasGiphy } from "@/lib/env";
import { PostForm } from "@/components/post-form/post-form";
import { isPostingClosed } from "@/lib/board-state";
import Link from "next/link";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) return {};
  if (board.visibility === "private") return { title: "A private board", robots: { index: false, follow: false } };
  return { title: `Add your message to ${board.title}`, robots: { index: false, follow: false } };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();
  if (!(await canViewBoard(board))) return <PrivateBoardNotice slug={board.slug} />;
  const closed = isPostingClosed(board);

  return (
    <div
      className="min-h-screen"
      style={{
        ...boardThemeVars(board.theme),
        background: "var(--board-bg)",
        fontFamily: "var(--board-font-body)",
      }}
    >
      {closed ? (
        <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl" style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}>
            {board.status === "delivered" ? `This board has been delivered to ${board.recipientName}` : "Messages are closed"}
          </h1>
          <p className="mt-3 text-[var(--board-ink)]/65">
            It isn&apos;t taking new messages any more, but you can still read everything on it.
          </p>
          <Link
            href={`/b/${board.slug}`}
            className="mt-8 rounded-full px-6 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--board-accent)" }}
          >
            See the board
          </Link>
        </div>
      ) : (
      <PostForm
        boardSlug={board.slug}
        boardTitle={board.title}
        motionProfile={board.occasionType.motionProfile}
        accent={board.theme.palette.accent}
        accentSoft={board.theme.palette.accentSoft}
        ink={board.theme.palette.ink}
        surface={board.theme.palette.surface}
        occasionKey={board.occasionType.key}
        mediaEnabled={hasR2}
        gifEnabled={hasGiphy}
        promptText={board.occasionType.promptText}
        recipientName={board.recipientName}
        recipientBio={board.recipientBio}
        recipientPhoto={board.recipientPhotos?.[0] ?? null}
      />
      )}
    </div>
  );
}
