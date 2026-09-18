// Board schemas shared by the client forms (react-hook-form resolvers) and the server
// actions that re-validate the same input, so both sides always agree on the rules.
import { z } from "zod";

export const RECIPIENT_PHOTO_LIMIT = 4;
export const RECIPIENT_BIO_MAX = 600;

const recipientName = z
  .string()
  .trim()
  .min(1, "Tell us who this board is for.")
  .max(80, "Please keep the name under 80 characters.");
const title = z
  .string()
  .trim()
  .min(1, "Give the board a title.")
  .max(120, "Please keep the title under 120 characters.");
const headline = z.string().trim().max(200, "Please keep the headline under 200 characters.");
const recipientBio = z
  .string()
  .trim()
  .max(RECIPIENT_BIO_MAX, `Please keep this under ${RECIPIENT_BIO_MAX} characters.`);
// Uploaded photos are absolute R2 URLs; the example boards use our own /images/ files.
const recipientPhotos = z
  .array(
    z
      .string()
      .refine(
        (v) => v.startsWith("/images/") || URL.canParse(v),
        "One of the photos didn't upload properly. Please remove it and try again."
      )
  )
  .max(RECIPIENT_PHOTO_LIMIT, `You can add up to ${RECIPIENT_PHOTO_LIMIT} photos.`);

export const visibilitySchema = z.enum(["public", "unlisted", "private"]);

// The "Tell us about them" step of /create.
export const boardDetailsSchema = z.object({
  recipientName,
  title,
  headline,
  recipientBio,
  recipientPhotos,
});
export type BoardDetailsValues = z.infer<typeof boardDetailsSchema>;

export const createBoardSchema = boardDetailsSchema.extend({
  occasionKey: z.string().min(1),
  themeId: z.string().uuid(),
  mode: z.enum(["collaborative", "tribute"]),
  visibility: visibilitySchema.default("public"),
});
export type CreateBoardInput = z.input<typeof createBoardSchema>;

// Owner-side board settings on /dashboard/b/[slug].
export const boardSettingsSchema = boardDetailsSchema.extend({ visibility: visibilitySchema });
export type BoardSettingsValues = z.infer<typeof boardSettingsSchema>;
