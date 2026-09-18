"use client";

// The board's masonry of posts plus the post lightbox (BUILD_PLAN hours 2–4): tap a photo
// or message to read it large, then ←/→ (or swipe) through the board, Esc to close. The
// dialog renders inside the board's own element so it keeps the board's theme variables.
// Motion follows the profile: solemn boards only ever cross-fade.
import { useRef, useState } from "react";
import Image from "next/image";
import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Reveal } from "./reveal";
import { PostCard } from "./post-card";
import { ReactionBar } from "./reaction-bar";
import type { PostRow } from "@/lib/types";
import type { ReactionCounts } from "@/lib/reactions";

type Profile = "celebratory" | "warm" | "solemn";

export function PostGrid({
  posts,
  profile,
  reactions,
}: {
  posts: PostRow[];
  profile: Profile;
  reactions: Record<string, ReactionCounts>;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const touchX = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const [counts, setCounts] = useState(reactions);
  const setPostCounts = (postId: string) => (next: ReactionCounts) => setCounts((all) => ({ ...all, [postId]: next }));

  const go = (delta: number) => {
    if (openIndex === null || posts.length < 2) return;
    setDirection(delta);
    // Functional update: rapid taps/keys must each move one step from the latest index.
    setOpenIndex((i) => (i === null ? i : (i + delta + posts.length) % posts.length));
  };

  const current = openIndex !== null ? posts[openIndex] : null;
  const slide = !reducedMotion && profile !== "solemn";

  return (
    <div ref={containerRef}>
      <div className="mx-auto max-w-5xl columns-1 gap-5 px-6 pb-24 sm:columns-2 lg:columns-3">
        {posts.map((post, i) => (
          <div key={post.id} className="mb-5">
            <Reveal profile={profile} inView delay={Math.min(i % 6, 5) * 0.06}>
              <PostCard
                post={post}
                onOpen={() => {
                  setDirection(0);
                  setOpenIndex(i);
                }}
                footer={
                  <ReactionBar
                    postId={post.id}
                    profile={profile}
                    counts={counts[post.id] ?? {}}
                    onCountsChange={setPostCounts(post.id)}
                  />
                }
              />
            </Reveal>
          </div>
        ))}
      </div>

      <Dialog.Root open={openIndex !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <Dialog.Portal container={containerRef}>
          <Dialog.Backdrop
            className="fixed inset-0 z-[90] backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
            style={{ background: "color-mix(in srgb, var(--board-ink) 78%, black)" }}
          />
          <Dialog.Popup
            className="fixed inset-0 z-[91] flex flex-col items-center justify-center p-4 outline-none transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none sm:p-8"
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") go(1);
              if (e.key === "ArrowLeft") go(-1);
            }}
            onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX.current === null) return;
              const dx = e.changedTouches[0].clientX - touchX.current;
              touchX.current = null;
              if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            }}
          >
            <div className="flex w-full max-w-2xl items-center justify-between pb-3 text-sm text-white/75">
              <span aria-live="polite">
                {openIndex !== null ? `${openIndex + 1} of ${posts.length}` : ""}
              </span>
              <Dialog.Close
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X size={20} />
              </Dialog.Close>
            </div>

            <div className="relative flex w-full max-w-2xl items-center">
              <AnimatePresence mode="wait" initial={false} custom={direction}>
                {current ? (
                  <motion.article
                    key={current.id}
                    initial={{ opacity: 0, x: slide ? direction * 24 : 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: slide ? direction * -24 : 0 }}
                    transition={{ duration: reducedMotion ? 0.1 : profile === "solemn" ? 0.35 : 0.22, ease: "easeOut" }}
                    className="max-h-[78vh] w-full overflow-y-auto rounded-3xl shadow-2xl"
                    style={{ background: current.mediaType === "none" ? "var(--board-accent-soft)" : "var(--board-surface)" }}
                  >
                    {current.mediaType === "video" && current.mediaUrl ? (
                      <video src={current.mediaUrl} controls autoPlay={!reducedMotion} className="max-h-[55vh] w-full bg-black" />
                    ) : current.mediaType === "gif" && current.gifUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element -- animated GIFs must not be re-encoded
                      <img src={current.gifUrl} alt="" className="max-h-[55vh] w-full bg-black/5 object-contain" />
                    ) : current.mediaUrl ? (
                      <div className="relative h-[55vh] w-full bg-black/5">
                        <Image src={current.mediaUrl} alt="" fill sizes="(min-width: 672px) 672px, 100vw" className="object-contain" />
                      </div>
                    ) : null}
                    <div className="p-6 sm:p-8">
                      <Dialog.Title
                        className="text-xl leading-relaxed whitespace-pre-line sm:text-2xl"
                        style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
                      >
                        {current.body}
                      </Dialog.Title>
                      <Dialog.Description className="mt-5 text-sm font-medium" style={{ color: "var(--board-accent)" }}>
                        {current.authorName}
                      </Dialog.Description>
                      <div className="mt-5">
                        <ReactionBar
                          postId={current.id}
                          profile={profile}
                          counts={counts[current.id] ?? {}}
                          onCountsChange={setPostCounts(current.id)}
                          size="lg"
                        />
                      </div>
                    </div>
                  </motion.article>
                ) : null}
              </AnimatePresence>
            </div>

            {posts.length > 1 ? (
              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous message"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next message"
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            ) : null}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
