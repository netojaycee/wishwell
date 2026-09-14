"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { createBoardAction } from "@/app/actions/boards";
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

  const transition = reducedMotion ? { duration: 0.15 } : { duration: 0.35, ease: "easeOut" as const };

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <ol className="mb-10 flex items-center justify-center gap-2 text-xs font-medium text-black/40">
        {STEP_LABELS.map((label, i) => (
          <li key={label} className={`flex items-center gap-2 ${i <= step ? "text-black" : ""}`}>
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full border text-[11px] ${
                i <= step ? "border-black bg-black text-white" : "border-black/20"
              }`}
            >
              {i + 1}
            </span>
            {label}
            {i < STEP_LABELS.length - 1 ? <span className="mx-1 text-black/20">—</span> : null}
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div key="step0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={transition}>
            <h1 className="font-heading text-3xl">What&apos;s the occasion?</h1>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {occasions.map((o) => (
                <button
                  key={o.key}
                  onClick={() => selectOccasion(o.key)}
                  className="rounded-2xl border border-black/10 p-4 text-left transition hover:border-black/30 hover:shadow-sm"
                  style={{ background: o.themes[0]?.palette.bg }}
                >
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ background: o.themes[0]?.palette.accent }}
                  />
                  <p className="mt-2 text-sm font-medium">{o.label}</p>
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
            <h1 className="font-heading text-3xl">Tell us about them</h1>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium">Recipient&apos;s name</label>
                <input
                  autoFocus
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Joyce"
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-[15px]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Board title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-[15px]"
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
                  className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-[15px]"
                />
              </div>
              <button
                disabled={!canContinueStep1}
                onClick={() => setStep(2)}
                className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
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
            <h1 className="font-heading text-3xl">Pick a look</h1>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {occasion.themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setThemeId(t.id)}
                  className={`overflow-hidden rounded-2xl border-2 text-left transition ${
                    themeId === t.id ? "border-black" : "border-transparent"
                  }`}
                >
                  <div
                    className="flex h-24 items-end p-3"
                    style={{ background: t.palette.bg }}
                  >
                    <span
                      className="rounded-full px-2 py-1 text-[11px] font-medium"
                      style={{ background: t.palette.accentSoft, color: t.palette.accent }}
                    >
                      {t.name}
                    </span>
                  </div>
                  <div className="flex gap-1 p-2" style={{ background: t.palette.surface }}>
                    {[t.palette.accent, t.palette.accentSoft, t.palette.ink].map((c, i) => (
                      <span key={i} className="h-4 w-4 rounded-full" style={{ background: c }} />
                    ))}
                  </div>
                </button>
              ))}
            </div>

            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

            <button
              disabled={!themeId || submitting}
              onClick={handleCreate}
              className="mt-6 w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {submitting ? "Creating your board…" : "Create the board"}
            </button>
          </motion.div>
        ) : null}

        {step === 3 && resultSlug ? (
          <motion.div key="step3" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={transition} className="text-center">
            <h1 className="font-heading text-3xl">Your board is live</h1>
            <p className="mt-3 text-black/60">Share this link with anyone you want to contribute — no account needed.</p>
            <p className="mt-6 rounded-xl border border-black/10 bg-black/[0.02] px-4 py-3 font-mono text-sm">
              {typeof window !== "undefined" ? window.location.host : ""}/b/{resultSlug}
            </p>
            <div className="mt-6 flex flex-col items-center gap-3">
              <Link
                href={`/b/${resultSlug}`}
                className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white"
              >
                View your board
              </Link>
              <p className="text-xs text-black/40">
                Sign in anytime to manage this board, moderate posts, and invite people by email.
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
