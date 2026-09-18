"use client";

// Fullscreen autoplay presentation, Ken Burns drift + cross-fade (DESIGN.md signature
// moment #4: "Plays at parties and funerals alike"). Motion-profile-agnostic by design;
// only prefers-reduced-motion changes behavior (plain cross-fade, no pan/zoom).
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { BoardWithRelations, PostRow } from "@/lib/types";
import { boardThemeVars } from "@/lib/theme/vars";

const SLIDE_DURATION_MS = 6000;

export function SlideshowPlayer({ board, posts }: { board: BoardWithRelations; posts: PostRow[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (paused || posts.length <= 1) return;
    const timer = setTimeout(() => setIndex((i) => (i + 1) % posts.length), SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [index, paused, posts.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % posts.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + posts.length) % posts.length);
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [posts.length]);

  if (posts.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        <p>No posts to show yet.</p>
      </div>
    );
  }

  const post = posts[index];
  const hasMedia = post.mediaType !== "none" && (post.mediaUrl || post.gifUrl);

  return (
    <div
      className="relative h-screen w-full overflow-hidden bg-black"
      style={boardThemeVars(board.theme)}
      onClick={() => setPaused((p) => !p)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={post.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center"
          style={{ background: hasMedia ? "black" : "var(--board-bg)" }}
        >
          {hasMedia ? (
            <motion.div
              initial={{ scale: reducedMotion ? 1 : 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: SLIDE_DURATION_MS / 1000, ease: "linear" }}
              className="absolute inset-0"
            >
              {post.mediaType === "video" && post.mediaUrl ? (
                <video src={post.mediaUrl} autoPlay muted loop className="h-full w-full object-contain" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element -- fullscreen slideshow, needs raw <img> for Ken Burns transform
                <img
                  src={post.mediaType === "gif" ? post.gifUrl! : post.mediaUrl!}
                  alt=""
                  className="h-full w-full object-contain"
                />
              )}
            </motion.div>
          ) : null}

          <div
            className={
              hasMedia
                ? "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-10 text-left"
                : "max-w-2xl"
            }
          >
            <p
              className={hasMedia ? "text-xl text-white" : "text-3xl sm:text-4xl"}
              style={hasMedia ? undefined : { fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
            >
              {post.body}
            </p>
            <p
              className={hasMedia ? "mt-3 text-sm text-white/70" : "mt-4 text-lg"}
              style={hasMedia ? undefined : { color: "var(--board-accent)" }}
            >
              {post.authorName}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <Link
        href={`/b/${board.slug}`}
        onClick={(e) => e.stopPropagation()}
        className="absolute top-6 right-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur"
      >
        Exit
      </Link>

      <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
        {posts.map((p, i) => (
          <span
            key={p.id}
            className={`h-1.5 w-6 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
