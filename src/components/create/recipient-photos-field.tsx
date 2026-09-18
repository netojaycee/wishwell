"use client";

// Up to 4 photos of the person a board is for (or anything that does them justice).
// The first photo is the main portrait on the board and the post page; any other photo
// can be promoted to main. Shared by /create and the owner's board settings.
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Star, X } from "lucide-react";
import { shrinkImage, uploadFile } from "@/lib/upload-client";
import { RECIPIENT_PHOTO_LIMIT } from "@/lib/validation/board";

const ACCEPT = "image/jpeg,image/png,image/webp";
const MAX_SOURCE_BYTES = 25 * 1024 * 1024;

export function RecipientPhotosField({
  value,
  onChange,
  recipientName,
  error,
  compact = false,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  recipientName?: string;
  error?: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  // One entry per file currently uploading, so each gets its own progress slot.
  const [uploads, setUploads] = useState<{ id: number; progress: number }[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);
  // Uploads finish out of order, so read the latest list through a ref, not a closure.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const remaining = RECIPIENT_PHOTO_LIMIT - value.length - uploads.length;

  const handleFiles = async (files: FileList) => {
    setUploadError(null);
    const picked = Array.from(files);
    if (picked.length > remaining) {
      setUploadError(`You can add up to ${RECIPIENT_PHOTO_LIMIT} photos, so only the first ${Math.max(remaining, 0)} were added.`);
    }
    await Promise.all(
      picked.slice(0, Math.max(remaining, 0)).map(async (original) => {
        if (!ACCEPT.split(",").includes(original.type)) {
          setUploadError("Please choose JPG, PNG or WebP photos.");
          return;
        }
        if (original.size > MAX_SOURCE_BYTES) {
          setUploadError("That photo is too large (max 25MB).");
          return;
        }
        const id = Math.random();
        setUploads((u) => [...u, { id, progress: 0 }]);
        const file = await shrinkImage(original);
        const result = await uploadFile(file, {
          purpose: "recipient",
          onProgress: (progress) => setUploads((u) => u.map((x) => (x.id === id ? { ...x, progress } : x))),
        });
        setUploads((u) => u.filter((x) => x.id !== id));
        if (!result.ok) {
          setUploadError(result.error);
          return;
        }
        const next = [...valueRef.current, result.url].slice(0, RECIPIENT_PHOTO_LIMIT);
        valueRef.current = next;
        onChange(next);
      })
    );
  };

  const who = recipientName?.trim() || "them";
  const shownError = uploadError ?? error;

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <ul className={`grid grid-cols-4 ${compact ? "gap-1.5" : "gap-2 sm:gap-3"}`}>
        {value.map((url, i) => (
          <li key={url} className="group relative aspect-square overflow-hidden rounded-xl bg-black/5 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- small preview of an uploaded photo */}
            <img src={url} alt={i === 0 ? `Main photo of ${who}` : `Photo ${i + 1} of ${who}`} className="h-full w-full object-cover" />
            {i === 0 ? (
              <span className="absolute bottom-1 left-1 rounded-full bg-black/60 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                Main
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onChange([url, ...value.filter((u) => u !== url)])}
                aria-label={`Make photo ${i + 1} the main photo`}
                title="Make main photo"
                className="absolute bottom-1 left-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white transition-opacity [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Star size={12} strokeWidth={2.25} />
              </button>
            )}
            <button
              type="button"
              onClick={() => onChange(value.filter((u) => u !== url))}
              aria-label={`Remove photo ${i + 1}`}
              className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white hover:bg-black/75"
            >
              <X size={13} strokeWidth={2.5} />
            </button>
          </li>
        ))}
        {uploads.map((u) => (
          <li
            key={u.id}
            className="relative flex aspect-square items-end overflow-hidden rounded-xl bg-[var(--brand-soft)]"
            aria-label={`Uploading, ${u.progress}%`}
          >
            <span className="fh-shimmer absolute inset-0" aria-hidden />
            <span className="relative m-1.5 h-1 flex-1 overflow-hidden rounded-full bg-black/10">
              <span className="block h-full bg-[var(--brand)] transition-[width]" style={{ width: `${u.progress}%` }} />
            </span>
          </li>
        ))}
        {Array.from({ length: Math.max(remaining, 0) }).map((_, i) =>
          i === 0 ? (
            <li key="add">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[var(--brand)]/40 text-[var(--brand)] transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]/50"
              >
                <ImagePlus size={compact ? 18 : 20} strokeWidth={1.75} />
                <span className="text-[11px] font-medium">{value.length ? "Add" : "Add photo"}</span>
              </button>
            </li>
          ) : (
            <li key={`empty-${i}`} aria-hidden className="aspect-square rounded-xl border-2 border-dashed border-black/[0.07]" />
          )
        )}
      </ul>
      {shownError ? (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {shownError}
        </p>
      ) : null}
    </div>
  );
}
