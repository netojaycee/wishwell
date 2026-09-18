// Resend client. No-ops until RESEND_API_KEY is set, see .env.example. Real delivery to
// arbitrary recipients additionally needs a verified sending domain on Resend's side.
import { Resend } from "resend";
import { env, hasResend } from "@/lib/env";

// Board titles are owner-supplied, so never interpolate them into email HTML unescaped.
export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function sendBoardInviteEmail({
  to,
  boardTitle,
  boardUrl,
  isPrivate = false,
}: {
  to: string;
  boardTitle: string;
  boardUrl: string;
  isPrivate?: boolean;
}) {
  if (!hasResend) {
    return { ok: false as const, error: "Email delivery isn't configured yet." };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Fondly Held <onboarding@resend.dev>",
    to,
    subject: `You're invited to sign ${boardTitle}`,
    html: `<p>You've been invited to add a message to <strong>${escapeHtml(boardTitle)}</strong>.</p><p><a href="${escapeHtml(boardUrl)}">Open the board</a></p>${
      isPrivate ? "<p>This board is private. This link is your personal key to it, so please don't forward it.</p>" : ""
    }`,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}

export async function sendPasswordResetEmail({ to, url }: { to: string; url: string }) {
  if (!hasResend) return { ok: false as const, error: "Email delivery isn't configured yet." };
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Fondly Held <onboarding@resend.dev>",
    to,
    subject: "Reset your Fondly Held password",
    html: `<p>Someone asked to reset the password for your Fondly Held account.</p><p><a href="${escapeHtml(url)}">Choose a new password</a></p><p>The link works for one hour. If this wasn't you, you can ignore this email and nothing will change.</p>`,
  });
  return error ? { ok: false as const, error: error.message } : { ok: true as const };
}
