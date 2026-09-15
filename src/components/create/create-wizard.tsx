"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Copy, Check, Share2 } from "lucide-react";
import { createBoardAction } from "@/app/actions/boards";
import { LogoMark } from "@/components/brand/logo-mark";
import type { OccasionTypeRow, ThemeRow } from "@/lib/types";

type OccasionWithThemes = OccasionTypeRow & { themes: ThemeRow[] };

const STEP_LABELS = ["Occasion", "Details", "Theme", "Done"];

export function CreateWizard({
  occasions,
  initialOccasionKey,
}: {
  occasions: OccasionWithThemes[];
  initialOccasionKey?: string;
}) {
  const preselected = occasions.find((o) => o.key === initialOccasionKey);
  const [step, setStep] = useState(preselected ? 1 : 0);
  const [occasionKey, setOccasionKey] = useState(preselected?.key ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [title, setTitle] = useState(preselected ? `${preselected.label} Board` : "");
  const [headline, setHeadline] = useState("");
  const [themeId, setThemeId] = useState(() => {
    if (!preselected) return "";
    const defaultTheme = preselected.themes.find((t) => t.isDefault) ?? preselected.themes[0];
    return defaultTheme?.id ?? "";
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultSlug, setResultSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const reducedMotion = useReducedMotion();

  const occasion = occasions.find((o) => o.key === occasionKey);

  const selectOccasion = (key: string) => {
    setOccasionKey(key);
    const o = occasions.find((oc) => oc.key === key)!;
    setTitle(`${o.label} Board`);
    const defaultTheme = o.themes.find((t) => t.isDefault) ?? o.themes[0];
    if (defaultTheme) setThemeId(defaultTheme.id);
    setStep(1);
  };

  const canContinueStep1 = recipientName.trim().length > 0 && title.trim().length > 0;

  const handleCreate = async () => {
    if (!occasion) return;
    setSubmitting(true);
    setError(null);

    const result = await createBoardAction({
      occasionKey: occasion.key,
      themeId,
      recipientName: recipientName.trim(),
      title: title.trim(),
      headline: headline.trim() || undefined,
      mode: occasion.category === "tribute" ? "tribute" : "collaborative",
      visibility: "public",
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setResultSlug(result.slug);
    setStep(3);
  };

  const shareUrl = resultSlug && typeof window !== "undefined" ? `${window.location.origin}/b/${resultSlug}` : "";
  const shareText =
    occasion && recipientName
      ? `${occasion.promptText} for ${recipientName} on Fondly Held — no account needed, just click and post.`
      : "Add your message on Fondly Held — no account needed, just click and post.";

  const copyLink = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    if (!shareUrl) return;
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, text: shareText, url: shareUrl });
      } catch {
        // user cancelled the native share sheet — not an error
      }
    } else {
      await copyLink();
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && "share" in navigator;

  const transition = reducedMotion ? { duration: 0.15 } : { duration: 0.35, ease: "easeOut" as const };

  return (
    <div className="min-h-full bg-[var(--background)]">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg" style={{ color: "var(--brand-ink)" }}>
          <LogoMark className="h-5 w-5 shrink-0" color="var(--brand)" />
          Fondly Held
        </Link>
      </header>

      <div className="mx-auto max-w-2xl px-5 pt-6 pb-20 sm:px-6">
        <ol className="mb-8 flex items-center justify-center gap-1.5 text-[11px] font-medium text-black/40 sm:gap-2 sm:text-xs">
          {STEP_LABELS.map((label, i) => (
            <li key={label} className={`flex items-center gap-1.5 sm:gap-2 ${i <= step ? "text-[var(--brand-ink)]" : ""}`}>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-[11px] transition-colors"
                style={{
                  background: i <= step ? "var(--brand-ink)" : "transparent",
                  color: i <= step ? "white" : undefined,
                  border: i <= step ? "none" : "1px solid rgba(0,0,0,0.2)",
                }}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{label}</span>
              {i < STEP_LABELS.length - 1 ? <span className="mx-0.5 text-black/20 sm:mx-1">—</span> : null}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
              <h1 className="text-center font-heading text-2xl sm:text-left sm:text-3xl">What&apos;s the occasion?</h1>
              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {occasions.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => selectOccasion(o.key)}
                    className="rounded-2xl border-2 p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                    style={{ background: o.themes[0]?.palette.bg, borderColor: o.themes[0]?.palette.accentSoft }}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full"
                      style={{ background: o.themes[0]?.palette.accent }}
                    />
                    <p className="mt-2.5 text-sm font-medium">{o.label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : null}

          {step === 1 && occasion ? (
            <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={transition}>
              <button onClick={() => setStep(0)} className="mb-4 text-sm text-black/50 hover:text-black">
                ← Change occasion
              </button>
              <h1 className="font-heading text-2xl sm:text-3xl">Tell us about them</h1>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Recipient&apos;s name</label>
                  <input
                    autoFocus
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Joyce"
                    className="mt-1.5 w-full rounded-xl border-2 border-black/10 px-4 py-3.5 text-base transition-colors focus:border-[var(--brand)] focus:outline-none sm:text-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Board title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border-2 border-black/10 px-4 py-3.5 text-base transition-colors focus:border-[var(--brand)] focus:outline-none sm:text-[15px]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">
                    Headline <span className="text-black/40">(optional)</span>
                  </label>
                  <input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="A little context for visitors"
                    className="mt-1.5 w-full rounded-xl border-2 border-black/10 px-4 py-3.5 text-base transition-colors focus:border-[var(--brand)] focus:outline-none sm:text-[15px]"
                  />
                </div>
                <button
                  disabled={!canContinueStep1}
                  onClick={() => setStep(2)}
                  className="w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
                  style={{ background: "var(--brand-ink)" }}
                >
                  Continue
                </button>
              </div>
            </motion.div>
          ) : null}

          {step === 2 && occasion ? (
            <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={transition}>
              <button onClick={() => setStep(1)} className="mb-4 text-sm text-black/50 hover:text-black">
                ← Back
              </button>
              <h1 className="font-heading text-2xl sm:text-3xl">Pick a look</h1>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {occasion.themes.map((t) => {
                  const selected = themeId === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setThemeId(t.id)}
                      className="overflow-hidden rounded-2xl border-2 text-left shadow-sm transition-all"
                      style={{
                        borderColor: selected ? t.palette.accent : "rgba(0,0,0,0.1)",
                        boxShadow: selected ? `0 0 0 3px ${t.palette.accentSoft}` : undefined,
                      }}
                    >
                      <div className="flex h-24 items-end p-3" style={{ background: t.palette.bg }}>
                        <span
                          className="rounded-full px-2 py-1 text-[11px] font-medium"
                          style={{ background: t.palette.accentSoft, color: t.palette.accent }}
                        >
                          {t.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3" style={{ background: t.palette.surface }}>
                        <div className="flex gap-1.5">
                          {[t.palette.accent, t.palette.accentSoft, t.palette.ink].map((c, i) => (
                            <span key={i} className="h-4 w-4 rounded-full" style={{ background: c }} />
                          ))}
                        </div>
                        {selected ? (
                          <span
                            className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white"
                            style={{ background: t.palette.accent }}
                          >
                            ✓
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

              <button
                disabled={!themeId || submitting}
                onClick={handleCreate}
                className="mt-6 w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform enabled:hover:scale-[1.01] disabled:opacity-40"
                style={{ background: "var(--brand-ink)" }}
              >
                {submitting ? "Creating your board…" : "Create the board"}
              </button>
            </motion.div>
          ) : null}

          {step === 3 && resultSlug ? (
            <motion.div key="step3" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={transition} className="text-center">
              <h1 className="font-heading text-2xl sm:text-3xl">Your board is live</h1>
              <p className="mt-3 text-black/60">Share this link with anyone you want to contribute — no account needed.</p>
              <p className="mt-6 rounded-xl border-2 border-black/10 bg-black/[0.02] px-4 py-3 font-mono text-sm break-all">
                {typeof window !== "undefined" ? window.location.host : ""}/b/{resultSlug}
              </p>

              <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={canNativeShare ? shareLink : copyLink}
                  className="flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:scale-[1.01] sm:w-auto"
                  style={{ background: "var(--brand-ink)" }}
                >
                  {canNativeShare ? (
                    <>
                      <Share2 size={16} strokeWidth={2} /> Share the link
                    </>
                  ) : copied ? (
                    <>
                      <Check size={16} strokeWidth={2} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} strokeWidth={2} /> Copy link
                    </>
                  )}
                </button>
                {canNativeShare ? (
                  <button
                    onClick={copyLink}
                    className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-black/10 px-6 py-3.5 text-sm font-semibold sm:w-auto"
                  >
                    {copied ? (
                      <>
                        <Check size={16} strokeWidth={2} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={16} strokeWidth={2} /> Copy instead
                      </>
                    )}
                  </button>
                ) : null}
              </div>

              <Link href={`/b/${resultSlug}`} className="mt-4 inline-block text-sm font-medium underline underline-offset-2" style={{ color: "var(--brand)" }}>
                View your board
              </Link>

              <div
                className="mt-10 rounded-2xl border-2 p-5 text-left"
                style={{ borderColor: "var(--brand-soft)", background: "var(--brand-soft)" }}
              >
                <p className="font-heading text-lg" style={{ color: "var(--brand-ink)" }}>
                  Keep this board safe
                </p>
                <p className="mt-1.5 text-sm text-black/60">
                  Right now, this board only lives at the link above — create a free account
                  and it&apos;ll be saved to yours automatically, so you can moderate posts,
                  invite people by email, and never lose access to it.
                </p>
                <Link
                  href="/sign-up"
                  className="mt-3 inline-flex rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: "var(--brand-ink)" }}
                >
                  Create a free account
                </Link>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
