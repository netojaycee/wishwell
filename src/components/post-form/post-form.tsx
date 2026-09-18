"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { postFieldsSchema, POST_BODY_MAX, type PostFieldsValues } from "@/lib/validation/post";
import { LogoMark } from "@/components/brand/logo-mark";
import { OccasionArt } from "@/components/illustrations/occasion-art";
import { track } from "@/lib/analytics";
import { MediaUploader } from "./media-uploader";
import { GifPicker } from "./gif-picker";
import { SuccessState } from "./success-state";
import { PostPreviewCard } from "./post-preview-card";

type Media = { url: string; type: "image" | "video" | "gif" } | null;

export function PostForm({
  boardSlug,
  boardTitle,
  motionProfile,
  accent,
  accentSoft,
  ink,
  surface,
  occasionKey,
  mediaEnabled,
  gifEnabled,
  promptText,
  recipientName,
  recipientBio,
  recipientPhoto,
}: {
  boardSlug: string;
  boardTitle: string;
  motionProfile: "celebratory" | "warm" | "solemn";
  accent: string;
  accentSoft: string;
  ink: string;
  surface: string;
  occasionKey: string;
  mediaEnabled: boolean;
  gifEnabled: boolean;
  promptText: string;
  recipientName: string;
  recipientBio: string | null;
  recipientPhoto: string | null;
}) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PostFieldsValues>({
    resolver: zodResolver(postFieldsSchema),
    mode: "onTouched",
    defaultValues: { authorName: "", body: "" },
  });
  const [authorName = "", body = ""] = useWatch({ control, name: ["authorName", "body"] });
  const [media, setMedia] = useState<Media>(null);
  const [showGifPicker, setShowGifPicker] = useState(false);
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
        ink={ink}
        surface={surface}
        occasionKey={occasionKey}
      />
    );
  }

  const onSubmit = async (values: PostFieldsValues) => {
    setError(null);

    let data: { ok: boolean; error?: string };
    try {
      const res = await fetch(`/api/boards/${boardSlug}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          mediaUrl: media?.type !== "gif" ? media?.url : undefined,
          mediaType: media?.type ?? "none",
          gifUrl: media?.type === "gif" ? media?.url : undefined,
          website: "",
          renderedAt,
        }),
      });
      data = await res.json();
    } catch {
      setError("We couldn't reach the board. Check your connection and try again.");
      return;
    }

    if (!data.ok) {
      setError(data.error ?? "Something went wrong, please try again.");
      return;
    }

    track("post_created", { occasion: occasionKey, media: media?.type ?? "none" });
    setSuccess(true);
  };

  const remaining = POST_BODY_MAX - body.length;

  return (
    <div>
      <div className="px-6 pt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium opacity-60 transition-opacity hover:opacity-100"
          style={{ color: "var(--board-ink)" }}
        >
          <LogoMark className="h-4 w-4 shrink-0" color="currentColor" />
          Fondly Held
        </Link>
      </div>

      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-16">
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
        {/* Who you're writing to: their photo, name and a few words, so a contributor
            arriving cold from a group chat link feels at home before they type. */}
        <div
          className="mb-8 flex items-start gap-4 rounded-3xl p-4 shadow-sm sm:p-5"
          style={{ background: "var(--board-surface)" }}
        >
          {recipientPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element -- user photo from R2; image optimization is off site-wide
            <img
              src={recipientPhoto}
              alt={recipientName}
              className="h-20 w-16 shrink-0 rounded-2xl object-cover object-[50%_30%] shadow-md sm:h-24 sm:w-20"
            />
          ) : (
            <OccasionArt
              occasionKey={occasionKey}
              profile={motionProfile}
              palette={{ accent, accentSoft, ink, surface }}
              className="h-14 w-14 shrink-0"
            />
          )}
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: accent }}>
              You&apos;re writing to
            </p>
            <p className="mt-0.5 truncate text-2xl" style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}>
              {recipientName}
            </p>
            {recipientBio ? (
              <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed whitespace-pre-line text-[var(--board-ink)]/65">
                {recipientBio}
              </p>
            ) : null}
          </div>
        </div>
        <h1
          className="text-3xl"
          style={{ fontFamily: "var(--board-font-heading)", color: "var(--board-ink)" }}
        >
          {promptText}
        </h1>
        <p className="mt-2 text-sm text-[var(--board-ink)]/60">for {boardTitle}</p>

        <div className="mt-8 space-y-6">
          <div>
            <input
              {...register("authorName")}
              aria-label="Your name"
              aria-invalid={Boolean(errors.authorName)}
              placeholder="Your name"
              autoComplete="name"
              className="w-full border-b-2 border-black/10 bg-transparent pb-2 text-lg outline-none transition-colors placeholder:text-[var(--board-ink)]/30 focus:border-[var(--board-accent)] aria-[invalid=true]:border-red-400"
              style={{ color: "var(--board-ink)" }}
            />
            {errors.authorName ? (
              <p role="alert" className="mt-1.5 text-sm text-red-600">
                {errors.authorName.message}
              </p>
            ) : null}
          </div>

          <div>
            {/* Styled to feel like writing on the card itself, not filling a form field,
                board's own heading font, no visible box until focused. */}
            <textarea
              {...register("body")}
              aria-label="Your message"
              aria-invalid={Boolean(errors.body)}
              rows={6}
              placeholder="Write something from the heart…"
              className="w-full resize-none rounded-2xl border-2 border-transparent bg-[var(--board-surface)] p-5 text-xl leading-relaxed outline-none transition-colors focus:border-[var(--board-accent)] aria-[invalid=true]:border-red-300"
              style={{ color: "var(--board-ink)", fontFamily: "var(--board-font-heading)" }}
            />
            <div className="mt-1.5 flex items-start justify-between gap-3">
              {errors.body ? (
                <p role="alert" className="text-sm text-red-600">
                  {errors.body.message}
                </p>
              ) : (
                <span />
              )}
              <p
                className="shrink-0 text-xs"
                style={{ color: remaining < 100 ? accent : "var(--board-ink)", opacity: remaining < 100 ? 1 : 0.35 }}
              >
                {remaining} left
              </p>
            </div>
          </div>

          {/* Honeypot, hidden from real people via CSS, catches bots that fill every field. */}
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
            disabled={isSubmitting}
            className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform disabled:opacity-60 enabled:hover:scale-[1.01]"
            style={{ background: accent }}
          >
            {isSubmitting ? "Posting…" : "Post to the board"}
          </button>
        </div>
      </form>

      {/* Live preview, hidden below lg, shown after the form on mobile so the flow
          stays form-first there. */}
      <div className="flex justify-center lg:sticky lg:top-16 lg:justify-start">
        <div className="w-full max-w-xs">
          <p className="mb-3 text-center text-xs font-medium tracking-wide uppercase opacity-40 lg:text-left" style={{ color: "var(--board-ink)" }}>
            How it will look
          </p>
          <PostPreviewCard authorName={authorName} body={body} media={media} accent={accent} accentSoft={accentSoft} />
        </div>
      </div>
      </div>
      <footer className="border-t border-[var(--board-ink)]/10 px-6 py-6 text-center text-sm opacity-50" style={{ color: "var(--board-ink)" }}>
        Made with{" "}
        <Link href="/" className="font-medium underline underline-offset-2">
          Fondly Held
        </Link>
      </footer>
    </div>
  );
}
