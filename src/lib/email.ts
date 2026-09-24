// Resend client. No-ops until RESEND_API_KEY is set, see .env.example. Real delivery to
// arbitrary recipients needs a verified sending domain on Resend's side; the sender is
// EMAIL_FROM (defaults to an address on mail.johnedeh.com, verified in Resend).
import { Resend } from "resend";
import { env, hasResend } from "@/lib/env";
import { escapeHtml } from "@/lib/email-escape";
import { renderBrandedEmail } from "@/lib/email-layout";

export { escapeHtml };

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
    from: env.EMAIL_FROM,
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
    from: env.EMAIL_FROM,
    to,
    subject: "Reset your Fondly Held password",
    html: `<p>Someone asked to reset the password for your Fondly Held account.</p><p><a href="${escapeHtml(url)}">Choose a new password</a></p><p>The link works for one hour. If this wasn't you, you can ignore this email and nothing will change.</p>`,
  });
  return error ? { ok: false as const, error: error.message } : { ok: true as const };
}

export async function sendVerificationEmail({ to, name, url }: { to: string; name: string; url: string }) {
  if (!hasResend) return { ok: false as const, error: "Email delivery isn't configured yet." };
  const first = name.trim().split(/\s+/)[0] || "there";
  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject: "Confirm your email for Fondly Held",
    html: renderBrandedEmail({
      preheader: "One tap to confirm your email and keep your boards safe.",
      heading: `Welcome, ${escapeHtml(first)}`,
      paragraphs: [
        "Thanks for making an account. Please confirm this is your email address so we can keep your boards, and the ones you've been invited to, safely yours.",
      ],
      ctaLabel: "Confirm my email",
      ctaUrl: url,
      footnote: "If you didn't create a Fondly Held account, you can ignore this email and nothing will happen.",
    }),
    text: `Welcome, ${first}. Confirm your email for Fondly Held: ${url}\n\nIf you didn't create an account, ignore this email.`,
  });
  return error ? { ok: false as const, error: error.message } : { ok: true as const };
}
