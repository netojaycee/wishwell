import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBoardBySlug } from "@/lib/data/boards";
import { boardThemeVars } from "@/lib/theme/vars";
import { hasR2, hasGiphy } from "@/lib/env";
import { PostForm } from "@/components/post-form/post-form";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) return {};
  return { title: `Add your message — ${board.title}`, robots: { index: false, follow: false } };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();

  return (
    <div
      className="min-h-screen"
      style={{
        ...boardThemeVars(board.theme),
        background: "var(--board-bg)",
        fontFamily: "var(--board-font-body)",
      }}
    >
      <PostForm
        boardSlug={board.slug}
        boardTitle={board.title}
        motionProfile={board.occasionType.motionProfile}
        accent={board.theme.palette.accent}
        accentSoft={board.theme.palette.accentSoft}
        mediaEnabled={hasR2}
        gifEnabled={hasGiphy}
        promptText={board.occasionType.promptText}
      />
    </div>
  );
}
