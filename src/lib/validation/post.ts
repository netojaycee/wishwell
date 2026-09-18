import { z } from "zod";

export const POST_BODY_MAX = 2000;

// The fields a contributor types; the client form validates exactly these.
export const postFieldsSchema = z.object({
  authorName: z
    .string()
    .trim()
    .min(1, "Please add your name so they know who it's from.")
    .max(60, "Please keep your name under 60 characters."),
  body: z
    .string()
    .trim()
    .min(1, "Write a few words before posting.")
    .max(POST_BODY_MAX, `Please keep your message under ${POST_BODY_MAX} characters.`),
});
export type PostFieldsValues = z.infer<typeof postFieldsSchema>;

export const createPostSchema = postFieldsSchema.extend({
  mediaUrl: z.string().url().optional(),
  mediaType: z.enum(["none", "image", "video", "gif"]).default("none"),
  gifUrl: z.string().url().optional(),
  // Honeypot: real contributors never fill this in. Bots that autofill every field do.
  website: z.string().max(0, "").optional().or(z.literal("")),
  // Timing check: form rendered_at timestamp, ms since epoch, from a hidden field.
  renderedAt: z.number(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;

export const MIN_SUBMIT_MS = 1500; // faster than this and it's a script, not a human
