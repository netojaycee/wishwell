// Shared branded HTML shell for transactional email (warm cream card, terracotta button,
// serif headings, matching the site). Table layout + inline styles because email clients
// ignore most modern CSS. Every interpolated value must already be escaped by the caller.
import { env } from "@/lib/env";
import { escapeHtml } from "@/lib/email-escape";

const BRAND = "#c4713f";
const INK = "#241c0a";
const SOFT = "#f2e4bc";
const CREAM = "#faf6ee";

export function renderBrandedEmail({
  preheader,
  heading,
  paragraphs,
  ctaLabel,
  ctaUrl,
  footnote,
}: {
  preheader: string;
  heading: string;
  paragraphs: string[];
  ctaLabel: string;
  ctaUrl: string;
  footnote: string;
}) {
  const origin = env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const url = escapeHtml(ctaUrl);
  const serif = "Georgia,'Times New Roman',serif";
  const sans = "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(heading)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${CREAM};">${escapeHtml(preheader)}&#8199;&zwnj;&#8199;&zwnj;&#8199;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${CREAM};"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;">
    <tr><td align="center" style="padding-bottom:20px;">
      <a href="${origin}" style="text-decoration:none;color:${INK};font-family:${serif};font-size:20px;">
        <img src="${origin}/apple-icon" width="28" height="28" alt="" style="vertical-align:middle;border-radius:7px;border:0;">
        <span style="vertical-align:middle;padding-left:8px;">Fondly Held</span>
      </a>
    </td></tr>
    <tr><td style="background:#ffffff;border:1px solid #eadfc9;border-radius:20px;overflow:hidden;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="height:6px;background:${BRAND};line-height:6px;font-size:6px;">&nbsp;</td></tr>
        <tr><td style="padding:36px 32px 32px;">
          <h1 style="margin:0 0 16px;font-family:${serif};font-weight:400;font-size:28px;line-height:1.25;color:${INK};">${escapeHtml(heading)}</h1>
          ${paragraphs.map((p) => `<p style="margin:0 0 16px;font-family:${sans};font-size:16px;line-height:1.6;color:#4a4130;">${p}</p>`).join("\n          ")}
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;"><tr><td style="background:${INK};border-radius:999px;">
            <a href="${url}" style="display:inline-block;padding:14px 28px;font-family:${sans};font-size:15px;font-weight:600;color:#ffffff;text-decoration:none;">${escapeHtml(ctaLabel)}</a>
          </td></tr></table>
          <p style="margin:20px 0 0;font-family:${sans};font-size:13px;line-height:1.5;color:#7a6f58;">Button not working? Paste this link into your browser:<br><a href="${url}" style="color:${BRAND};word-break:break-all;">${url}</a></p>
        </td></tr>
        <tr><td style="background:${SOFT};padding:16px 32px;font-family:${sans};font-size:13px;line-height:1.5;color:#5b4f33;">${footnote}</td></tr>
      </table>
    </td></tr>
    <tr><td align="center" style="padding:20px 8px 0;font-family:${sans};font-size:12px;line-height:1.5;color:#9a8e74;">Fondly Held &middot; one link, everyone contributes.</td></tr>
  </table>
</td></tr></table>
</body></html>`;
}
