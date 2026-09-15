"use client";

import { useState } from "react";
import { MediaUploader } from "./media-uploader";
import { GifPicker } from "./gif-picker";
import { SuccessState } from "./success-state";

type Media = { url: string; type: "image" | "video" | "gif" } | null;

export function PostForm({
  boardSlug,
  boardTitle,
  motionProfile,
  accent,
  accentSoft,
  mediaEnabled,
  gifEnabled,
  promptText,
}: {
  boardSlug: string;
  boardTitle: string;
  motionProfile: "celebratory" | "warm" | "solemn";
  accent: string;
  accentSoft: string;
  mediaEnabled: boolean;
  gifEnabled: boolean;
  promptText: string;
}) {
  const [authorName, setAuthorName] = useState("");
  const [body, setBody] = useState("");
  const [media, setMedia] = useState<Media>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [renderedAt] = useState(() => Date.now());

  if (success) {
    return (
      <SuccessState
        boardSlug={boardSlug}
        boardTitle={boardTitle}
        motionProfile={motionProfile}
        accent={accent}
        accentSoft={accentSoft}
      />
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const res = await fetch(`/api/boards/${boardSlug}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authorName,
        body,
        mediaUrl: media?.type !== "gif" ? media?.url : undefined,
        mediaType: media?.type ?? "none",
        gifUrl: media?.type === "gif" ? media?.url : undefined,
        website: "",
        renderedAt,
      }),
    });

    const data = await res.json();
    setSubmitting(false);

    if (!data.ok) {
      setError(data.error ?? "Something went wrong — please try again.");
      return;
    }

    setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg px-6 py-16">
      <h1
        className="text-3xl"
        style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
      >
        {promptText}
      </h1>
      <p className="mt-2 text-sm text-[var(--board-ink)]/60">for {boardTitle}</p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="block text-sm font-medium" style={{ color: "var(--board-ink)" }}>
            Your name
          </label>
          <input
            required
            maxLength={60}
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px]"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium" style={{ color: "var(--board-ink)" }}>
            Your message
          </label>
          <textarea
            required
            maxLength={2000}
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px]"
            placeholder="Write something from the heart…"
          />
        </div>

        {/* Honeypot — hidden from real people via CSS, catches bots that fill every field. */}
        <div className="absolute -left-[9999px]" aria-hidden="true">
          <label htmlFor="website">Leave this field empty</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        {mediaEnabled || gifEnabled ? (
          <div className="flex flex-wrap items-center gap-3">
            {mediaEnabled && !media ? (
              <MediaUploader
                accent={accent}
                onChange={(m) => setMedia(m ? { url: m.url, type: m.type } : null)}
              />
            ) : null}
            {gifEnabled && !media ? (
              <button
                type="button"
                onClick={() => setShowGifPicker((v) => !v)}
                className="rounded-full border px-4 py-2 text-sm font-medium"
                style={{ borderColor: accent, color: accent }}
              >
                Add a GIF
              </button>
            ) : null}
            {media?.type === "gif" ? (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- animated GIF preview */}
                <img src={media.url} alt="" className="h-16 w-16 rounded-lg object-cover" />
                <button type="button" onClick={() => setMedia(null)} className="text-sm underline underline-offset-2">
                  Remove
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {showGifPicker ? (
          <GifPicker
            onSelect={(url) => {
              setMedia({ url, type: "gif" });
              setShowGifPicker(false);
            }}
            onClose={() => setShowGifPicker(false)}
          />
        ) : null}

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
          style={{ background: accent }}
        >
          {submitting ? "Posting…" : "Post to the board"}
        </button>
      </div>
    </form>
  );
}
