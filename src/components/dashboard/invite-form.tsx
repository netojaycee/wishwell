"use client";

import { useState } from "react";
import { sendInviteAction } from "@/app/actions/invites";
import { track } from "@/lib/analytics";

export function InviteForm({ slug }: { slug: string }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setMessage(null);
    const result = await sendInviteAction(slug, email);
    setSending(false);
    setMessage(
      result.ok ? { ok: true, text: `Invite sent to ${email}.` } : { ok: false, text: result.error }
    );
    if (result.ok) {
      setEmail("");
      track("invite_sent");
    }
  };

  return (
    <div className="rounded-xl border border-black/10 p-4">
      <h2 className="font-heading text-lg">Share</h2>
      <button
        onClick={copyLink}
        className="mt-3 w-full rounded-full border border-black/10 px-4 py-2 text-sm font-medium"
      >
        {copied ? "Link copied" : "Copy share link"}
      </button>

      <form onSubmit={handleInvite} className="mt-4">
        <label className="block text-xs font-medium text-black/60">Invite by email</label>
        <div className="mt-1 flex gap-2">
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={sending}
            className="shrink-0 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {sending ? "…" : "Send"}
          </button>
        </div>
        {message ? (
          <p className={`mt-2 text-xs ${message.ok ? "text-emerald-600" : "text-black/50"}`}>{message.text}</p>
        ) : null}
      </form>
    </div>
  );
}
