"use client";

import { useState, useTransition } from "react";
import { hidePostAction, unhidePostAction, pinPostAction, deletePostAction } from "@/app/actions/moderation";
import type { PostRow } from "@/lib/types";

// Posts arrive with the reasons anyone reported them for (reported posts sorted first).
type ModerationPost = PostRow & { reports: string[] };

export function ModerationList({ posts, slug }: { posts: ModerationPost[]; slug: string }) {
  const [items, setItems] = useState(posts);
  const [isPending, startTransition] = useTransition();

  if (items.length === 0) {
    return <p className="mt-4 text-sm text-black/50">No posts yet.</p>;
  }

  return (
    <ul className="mt-4 space-y-3">
      {items.map((post) => (
        <li
          key={post.id}
          className={`rounded-xl border p-4 ${post.reports.length > 0 ? "border-red-200 bg-red-50/40" : "border-black/10"}`}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm">{post.body}</p>
              <p className="mt-1 text-xs text-black/50">
                {post.authorName} ·{" "}
                <span
                  className={
                    post.status === "published"
                      ? "text-emerald-600"
                      : post.status === "hidden"
                        ? "text-amber-600"
                        : "text-black/50"
                  }
                >
                  {post.status}
                </span>
                {post.pinned ? " · pinned" : ""}
              </p>
              {post.reports.length > 0 ? (
                <p className="mt-2 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-700">
                  Reported {post.reports.length} {post.reports.length === 1 ? "time" : "times"}:{" "}
                  {Array.from(new Set(post.reports)).join(" · ")}
                </p>
              ) : null}
            </div>
          </div>
          <div className="mt-3 flex gap-3 text-xs font-medium">
            {post.status === "published" ? (
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await hidePostAction(post.id, slug);
                    setItems((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: "hidden" } : p)));
                  })
                }
                className="text-amber-700 hover:underline"
              >
                Hide
              </button>
            ) : (
              <button
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    await unhidePostAction(post.id, slug);
                    setItems((prev) => prev.map((p) => (p.id === post.id ? { ...p, status: "published" } : p)));
                  })
                }
                className="text-emerald-700 hover:underline"
              >
                Unhide
              </button>
            )}
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  await pinPostAction(post.id, !post.pinned, slug);
                  setItems((prev) => prev.map((p) => (p.id === post.id ? { ...p, pinned: !p.pinned } : p)));
                })
              }
              className="hover:underline"
            >
              {post.pinned ? "Unpin" : "Pin"}
            </button>
            <button
              disabled={isPending}
              onClick={() =>
                startTransition(async () => {
                  if (!confirm("Delete this post permanently? This can't be undone.")) return;
                  await deletePostAction(post.id, slug);
                  setItems((prev) => prev.filter((p) => p.id !== post.id));
                })
              }
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
