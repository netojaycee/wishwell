import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getBoardBySlug } from "@/lib/data/boards";
import { listPublishedPosts } from "@/lib/data/posts";
import { SlideshowPlayer } from "@/components/board/slideshow-player";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  return board ? { title: `Slideshow — ${board.title}` } : {};
}

export default async function SlideshowPage({ params }: Params) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();

  const posts = await listPublishedPosts(board.id);

  return <SlideshowPlayer board={board} posts={posts} />;
}
