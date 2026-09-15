// Report-a-post input. Anonymous, so validated as strictly as posting (CLAUDE.md: all
// user-submitted content is untrusted).
import { z } from "zod";

export const REPORT_REASONS = [
  "Inappropriate or offensive",
  "Harassment or bullying",
  "Spam",
  "Shares private information",
  "Something else",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const reportSchema = z.object({
  reason: z.enum(REPORT_REASONS, { message: "Please choose a reason." }),
  details: z.string().trim().max(500, "Please keep it under 500 characters.").optional(),
  // Honeypot, same trick as the post form.
  website: z.string().max(0).optional().or(z.literal("")),
});
