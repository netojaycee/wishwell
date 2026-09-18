"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sendInviteAction } from "@/app/actions/invites";
import { track } from "@/lib/analytics";

const inviteSchema = z.object({
  email: z.string().trim().min(1, "Enter an email address.").email("That doesn't look like an email address."),
});
type InviteValues = z.infer<typeof inviteSchema>;

export function InviteForm({ slug, isPrivate }: { slug: string; isPrivate: boolean }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InviteValues>({ resolver: zodResolver(inviteSchema), defaultValues: { email: "" } });
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const url = shareUrl || `${window.location.origin}/b/${slug}`;
    await navigator.clipboard.writeText(url);
    setShareUrl(url);
    setCopied(true);
    track("board_link_shared", { via: "dashboard_copy" });
    setTimeout(() => setCopied(false), 2000);
  };

  const onInvite = async ({ email }: InviteValues) => {
    setMessage(null);
    const result = await sendInviteAction(slug, email);
    setMessage(
      result.ok ? { ok: true, text: `Invite sent to ${email}.` } : { ok: false, text: result.error }
    );
    if (result.ok) {
      reset();
      track("invite_sent");
    }
  };

  return (
    <div className="rounded-2xl border border-black/10 bg-white/70 p-4 shadow-sm">
      <h2 className="font-heading text-lg">Share</h2>
      <button
        onClick={copyLink}
        className="mt-3 w-full rounded-full border border-black/10 px-4 py-2 text-sm font-medium"
      >
        {copied ? "Link copied" : "Copy share link"}
      </button>
      {isPrivate ? (
        <p className="mt-2 text-xs leading-relaxed text-black/50">
          This board is private: the plain link only works for you. Invite people by email below,
          each invite is their personal key to the board.
        </p>
      ) : null}

      <form noValidate onSubmit={handleSubmit(onInvite)} className="mt-4">
        <label htmlFor={`invite-${slug}`} className="block text-xs font-medium text-black/60">
          Invite by email
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id={`invite-${slug}`}
            {...register("email")}
            type="email"
            autoComplete="off"
            aria-invalid={Boolean(errors.email)}
            placeholder="friend@example.com"
            className="w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm focus:border-[var(--brand)] focus:outline-none aria-[invalid=true]:border-red-400"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="shrink-0 rounded-lg bg-[var(--brand-ink)] px-3 py-2 text-sm font-semibold text-white transition-colors enabled:hover:bg-[var(--brand)] disabled:opacity-60"
          >
            {isSubmitting ? "Sending…" : "Send"}
          </button>
        </div>
        {errors.email ? (
          <p role="alert" className="mt-1.5 text-xs text-red-600">
            {errors.email.message}
          </p>
        ) : null}
        {message ? (
          <p className={`mt-2 text-xs ${message.ok ? "text-emerald-600" : "text-black/50"}`}>{message.text}</p>
        ) : null}
      </form>
    </div>
  );
}
