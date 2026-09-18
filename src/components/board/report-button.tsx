"use client";

// The global "report this post" control (CLAUDE.md guardrails: moderation from v1, global
// report button). Deliberately quiet, a small flag that appears on hover/focus (always
// visible on touch screens), so it never competes with the message, memorial boards
// included. The dialog is portalled to <body> because post cards are CSS-transformed
// (the handmade tilt), which would otherwise trap a `position: fixed` overlay in the card;
// the board's theme vars are copied onto the portal so it still matches the board.
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Flag, X } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { REPORT_REASONS, reportFieldsSchema, type ReportFieldsValues } from "@/lib/validation/report";

const THEME_VARS = ["--board-surface", "--board-ink", "--board-accent", "--board-accent-soft", "--board-font-heading"];

export function ReportButton({ postId }: { postId: string }) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [themeStyle, setThemeStyle] = useState<Record<string, string>>({});
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ReportFieldsValues>({ resolver: zodResolver(reportFieldsSchema), defaultValues: { details: "" } });
  const reason = useWatch({ control, name: "reason" });
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  const openDialog = () => {
    const computed = triggerRef.current ? getComputedStyle(triggerRef.current) : null;
    const vars: Record<string, string> = {};
    for (const name of THEME_VARS) {
      const value = computed?.getPropertyValue(name).trim();
      if (value) vars[name] = value;
    }
    setThemeStyle(vars);
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    if (status === "done") {
      reset();
      setStatus("idle");
    }
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const submit = async ({ reason, details }: ReportFieldsValues) => {
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch(`/api/posts/${postId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, details: details?.trim() || undefined, website: "" }),
      });
      const data = await res.json().catch(() => ({ ok: false }));
      if (!data.ok) {
        setStatus("idle");
        setError(data.error ?? "We couldn't send that report, please try again.");
        return;
      }
      setStatus("done");
    } catch {
      setStatus("idle");
      setError("We couldn't reach the server, check your connection and try again.");
    }
  };

  const titleId = `report-title-${postId}`;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={openDialog}
        aria-label="Report this post"
        title="Report this post"
        className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-black/45 shadow-sm backdrop-blur transition-opacity hover:text-black/75 focus-visible:opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        <Flag size={14} strokeWidth={2} />
      </button>

      {open
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
              style={themeStyle}
              onClick={(e) => {
                if (e.target === e.currentTarget) close();
              }}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className="w-full max-w-md rounded-t-3xl p-6 pb-8 shadow-2xl sm:rounded-3xl sm:pb-6"
                style={{ background: "var(--board-surface, #fff)", color: "var(--board-ink, #1c1b19)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 id={titleId} className="text-2xl" style={{ fontFamily: "var(--board-font-heading, inherit)" }}>
                    {status === "done" ? "Thank you" : "Report this post"}
                  </h2>
                  <button type="button" onClick={close} aria-label="Close" className="-mt-1 -mr-1 rounded-full p-1.5 opacity-50 hover:opacity-100">
                    <X size={18} />
                  </button>
                </div>

                {status === "done" ? (
                  <>
                    <p className="mt-3 text-sm leading-relaxed opacity-70">
                      Thanks for letting us know. The post has been flagged for review, and the
                      board&apos;s owner can hide or remove it.
                    </p>
                    <button
                      type="button"
                      onClick={close}
                      className="mt-6 w-full rounded-full px-6 py-3 text-sm font-semibold text-white"
                      style={{ background: "var(--board-accent, #241c0a)" }}
                    >
                      Done
                    </button>
                  </>
                ) : (
                  <form noValidate onSubmit={handleSubmit(submit)}>
                    <p className="mt-2 text-sm opacity-60">Reports are anonymous. What&apos;s wrong with this post?</p>
                    <fieldset className="mt-4 space-y-2">
                      <legend className="sr-only">Reason</legend>
                      {REPORT_REASONS.map((r) => (
                        <label
                          key={r}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors"
                          style={{
                            borderColor: reason === r ? "var(--board-accent, #241c0a)" : "color-mix(in srgb, currentColor 12%, transparent)",
                            background: reason === r ? "var(--board-accent-soft, #f2e4bc)" : "transparent",
                          }}
                        >
                          <input
                            type="radio"
                            {...register("reason")}
                            value={r}
                            className="accent-[var(--board-accent,#241c0a)]"
                          />
                          {r}
                        </label>
                      ))}
                    </fieldset>
                    {errors.reason ? (
                      <p role="alert" className="mt-2 text-sm text-red-600">
                        {errors.reason.message}
                      </p>
                    ) : null}
                    <textarea
                      {...register("details")}
                      aria-label="More details (optional)"
                      rows={2}
                      placeholder="Anything else we should know? (optional)"
                      className="mt-3 w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm outline-none focus:border-[var(--board-accent)]"
                      style={{ borderColor: "color-mix(in srgb, currentColor 12%, transparent)" }}
                    />
                    {errors.details ? (
                      <p role="alert" className="mt-1 text-sm text-red-600">
                        {errors.details.message}
                      </p>
                    ) : null}
                    {error ? <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
                    <div className="mt-5 flex gap-3">
                      <button type="button" onClick={close} className="flex-1 rounded-full border px-5 py-3 text-sm font-semibold" style={{ borderColor: "color-mix(in srgb, currentColor 15%, transparent)" }}>
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="flex-1 rounded-full px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                        style={{ background: "var(--board-accent, #241c0a)" }}
                      >
                        {status === "sending" ? "Sending…" : "Send report"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
