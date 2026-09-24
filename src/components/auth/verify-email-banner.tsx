"use client";

// Gentle nudge for accounts whose email isn't confirmed yet, with a resend button.
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function VerifyEmailBanner({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function resend() {
    setState("sending");
    const { error } = await authClient.sendVerificationEmail({ email, callbackURL: "/dashboard" });
    setState(error ? "error" : "sent");
  }

  return (
    <div role="status" className="relative border-b border-black/5 bg-[var(--brand-soft)]/60 px-6 py-3 text-sm text-[var(--brand-ink)]">
      <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p>
          {state === "sent"
            ? `We've sent a new link to ${email}. It can take a minute to arrive.`
            : state === "error"
              ? "We couldn't send that just now. Please try again in a moment."
              : `Please confirm your email address (${email}) to keep your account safe.`}
        </p>
        {state === "sent" ? null : (
          <button
            type="button"
            onClick={resend}
            disabled={state === "sending"}
            className="font-medium underline underline-offset-2 hover:text-[var(--brand)] disabled:opacity-60"
          >
            {state === "sending" ? "Sending…" : "Send the link again"}
          </button>
        )}
      </div>
    </div>
  );
}
