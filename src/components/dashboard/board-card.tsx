// One board on the owner's dashboard: a header in the board's own palette showing who it's
// for (their photos as a small fan of prints, else the occasion art), then title, count and
// links. Shared by /dashboard.
import Link from "next/link";
import Image from "next/image";
import { OccasionArt } from "@/components/illustrations/occasion-art";
import { RecipientPortrait } from "@/components/board/recipient-portrait";
import { boardThemeVars } from "@/lib/theme/vars";
import type { BoardWithRelations } from "@/lib/types";

export function BoardCard({ board }: { board: BoardWithRelations & { postCount: number } }) {
  const palette = board.theme.palette;
  return (
    <li
      className="group overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Header in the board's own palette. The recipient's photos sit as a small
          fan of prints (portraits cropped as a wide banner lose the face). */}
      <div
        className="relative flex h-36 items-center justify-between gap-3 overflow-hidden px-5"
        style={{
          ...boardThemeVars(board.theme),
          background: `linear-gradient(135deg, ${palette.bg} 35%, ${palette.accentSoft})`,
        }}
      >
        <div className="min-w-0 self-end pb-4">
          <span
            className="inline-flex rounded-full px-2 py-1 text-[11px] font-medium"
            style={{ background: palette.accentSoft, color: palette.accent }}
          >
            {board.occasionType.label}
          </span>
          <p
            className="mt-1.5 truncate text-lg"
            style={{ fontFamily: "var(--board-font-heading)", color: palette.ink }}
          >
            for {board.recipientName}
          </p>
        </div>
        {board.recipientPhotos.length ? (
          <div className="shrink-0 pr-2">
            <RecipientPortrait
              photos={board.recipientPhotos.slice(0, 3)}
              name={board.recipientName}
              profile={board.occasionType.motionProfile}
              size="sm"
            >
              <span
                className="absolute -right-2 -bottom-2 flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-sm"
                style={{ background: palette.accentSoft, borderColor: palette.surface }}
              >
                <OccasionArt
                  occasionKey={board.occasionType.key}
                  profile={board.occasionType.motionProfile}
                  palette={palette}
                  className="h-6 w-6"
                />
              </span>
            </RecipientPortrait>
          </div>
        ) : board.coverImageUrl ? (
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-[3px] shadow-md" style={{ borderColor: palette.surface }}>
            <Image src={board.coverImageUrl} alt="" fill sizes="96px" className="object-cover" />
          </div>
        ) : (
          <OccasionArt
            occasionKey={board.occasionType.key}
            profile={board.occasionType.motionProfile}
            palette={palette}
            animate="hover"
            className="h-24 w-24 shrink-0"
          />
        )}
      </div>
      <div className="p-4">
        <p className="font-medium">{board.title}</p>
        <p className="text-sm text-black/50">
          {board.postCount} {board.postCount === 1 ? "post" : "posts"} · {board.status}
        </p>
        <div className="mt-3 flex gap-3 text-sm">
          <Link href={`/dashboard/b/${board.slug}`} className="font-medium underline underline-offset-2">
            Manage
          </Link>
          <Link href={`/b/${board.slug}`} className="text-black/50 underline underline-offset-2">
            View
          </Link>
        </div>
      </div>
    </li>
  );
}
