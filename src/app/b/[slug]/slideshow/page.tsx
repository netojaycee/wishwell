import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBoardBySlug } from "@/lib/data/boards";
import { canViewBoard } from "@/lib/access";
import { PrivateBoardNotice } from "@/components/board/private-board-notice";
import { listPublishedPosts } from "@/lib/data/posts";
import { SlideshowPlayer } from "@/components/board/slideshow-player";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) return {};
  if (board.visibility === "private") return { title: "A private board", robots: { index: false, follow: false } };
  return { title: `${board.title} slideshow`, robots: { index: false, follow: false } };
}

export default async function SlideshowPage({ params }: Params) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();
  if (!(await canViewBoard(board))) return <PrivateBoardNotice slug={board.slug} />;

  const posts = await listPublishedPosts(board.id);

  return <SlideshowPlayer board={board} posts={posts} />;
}
