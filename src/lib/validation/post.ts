import { z } from "zod";

export const createPostSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required").max(60),
  body: z.string().trim().min(1, "Message can't be empty").max(2000),
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
