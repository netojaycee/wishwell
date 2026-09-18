// Resend client. No-ops until RESEND_API_KEY is set, see .env.example. Real delivery to
// arbitrary recipients additionally needs a verified sending domain on Resend's side.
import { Resend } from "resend";
import { env, hasResend } from "@/lib/env";

export async function sendBoardInviteEmail({
  to,
  boardTitle,
  boardUrl,
}: {
  to: string;
  boardTitle: string;
  boardUrl: string;
}) {
  if (!hasResend) {
    return { ok: false as const, error: "Email delivery isn't configured yet." };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: "Fondly Held <onboarding@resend.dev>",
    to,
    subject: `You're invited to sign ${boardTitle}`,
    html: `<p>You've been invited to add a message to <strong>${boardTitle}</strong>.</p><p><a href="${boardUrl}">Open the board</a></p>`,
  });

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const };
}
