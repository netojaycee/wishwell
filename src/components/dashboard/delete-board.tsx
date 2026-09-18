"use client";

// Owner's "danger zone" on /dashboard/b/[slug]: permanently deletes the board, every post
// on it and every uploaded file (see deleteBoardWithMedia).
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteBoardAction } from "@/app/actions/moderation";

export function DeleteBoard({ boardId, title, postCount }: { boardId: string; title: string; postCount: number }) {
  return (
    <div className="rounded-2xl border border-red-100 bg-white/70 p-4 shadow-sm">
      <h2 className="font-heading text-lg">Delete this board</h2>
      <p className="mt-1 mb-3 text-xs leading-relaxed text-black/55">
        Removes the board, all {postCount} {postCount === 1 ? "post" : "posts"} and every photo and
        video on it. This can&apos;t be undone.
      </p>
      <ConfirmDialog
        triggerLabel="Delete board"
        title="Delete this board?"
        description={
          <>
            <strong className="font-medium text-black/80">{title}</strong> and everything on it will be
            permanently deleted, including photos and videos. The link will stop working.
          </>
        }
        confirmLabel="Delete forever"
        onConfirm={async () => {
          // On success the action redirects to /dashboard, so we only ever see a failure here.
          const result = await deleteBoardAction(boardId);
          if (result && !result.ok) return result.error;
        }}
      />
    </div>
  );
}
