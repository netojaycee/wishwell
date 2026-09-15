import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { after } from "next/server";
import { getBoardBySlug, incrementBoardView } from "@/lib/data/boards";
import { listPublishedPosts, countPublishedPosts } from "@/lib/data/posts";
import { boardThemeVars } from "@/lib/theme/vars";
import { BoardHero } from "@/components/board/board-hero";
import { PostGrid } from "@/components/board/post-grid";
import { EmptyState } from "@/components/board/empty-state";
import { BoardAmbient } from "@/components/board/board-ambient";

export const revalidate = 60;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) return {};

  const title = `${board.title} — a ${board.occasionType.label.toLowerCase()} board for ${board.recipientName}`;
  const description = board.headline ?? `Add your message to ${board.recipientName}'s board on Fondly Held.`;
  const noindex = board.visibility !== "public";

  return {
    title,
    description,
    robots: noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      // Only set `images` when there's a real cover photo — an explicit `images:
      // undefined` key (even though the value is undefined) suppresses Next's
      // auto-detected opengraph-image.tsx for this route, which was the actual bug:
      // almost no boards have coverImageUrl set, so nearly every board link was
      // silently losing its OG image.
      ...(board.coverImageUrl ? { images: [{ url: board.coverImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function BoardPage({ params }: Params) {
  const { slug } = await params;
  const board = await getBoardBySlug(slug);
  if (!board) notFound();

  const [posts, postCount] = await Promise.all([
    listPublishedPosts(board.id),
    countPublishedPosts(board.id),
  ]);

  after(() => incrementBoardView(board.id));

  const profile = board.occasionType.motionProfile;

  return (
    // `isolate` makes this a stacking context so BoardAmbient's -z-10 layers paint above
    // this div's own background instead of disappearing behind it.
    <div
      className="relative isolate min-h-screen"
      style={{
        ...boardThemeVars(board.theme),
        background: "var(--board-bg)",
        fontFamily: "var(--board-font-body)",
      }}
    >
      <BoardAmbient
        motionProfile={profile}
        accent={board.theme.palette.accent}
        accentSoft={board.theme.palette.accentSoft}
        particleEffect={board.theme.particleEffect}
      />
      <BoardHero board={board} postCount={postCount} />
      {posts.length > 0 ? (
        <PostGrid posts={posts} profile={profile} />
      ) : (
        <EmptyState
          slug={board.slug}
          mode={board.mode}
          profile={profile}
          occasionKey={board.occasionType.key}
          palette={board.theme.palette}
        />
      )}
      {posts.length > 0 ? (
        <div className="pb-16 text-center">
          <Link
            href={`/b/${board.slug}/slideshow`}
            className="text-sm font-medium underline underline-offset-2"
            style={{ color: "var(--board-accent)" }}
          >
            View as slideshow
          </Link>
        </div>
      ) : null}
      <footer className="border-t border-[var(--board-ink)]/10 px-6 py-8 text-center text-sm text-[var(--board-ink)]/50">
        Made with{" "}
        <Link href="/" className="font-medium underline underline-offset-2">
          Fondly Held
        </Link>
      </footer>
    </div>
  );
}
