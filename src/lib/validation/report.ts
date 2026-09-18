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

// What the reporter fills in; the dialog validates exactly these.
export const reportFieldsSchema = z.object({
  reason: z.enum(REPORT_REASONS, { message: "Please choose a reason." }),
  details: z.string().trim().max(500, "Please keep it under 500 characters.").optional(),
});
export type ReportFieldsValues = z.infer<typeof reportFieldsSchema>;

export const reportSchema = reportFieldsSchema.extend({
  // Honeypot, same trick as the post form.
  website: z.string().max(0).optional().or(z.literal("")),
});
