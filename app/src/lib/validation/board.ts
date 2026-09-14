import { z } from "zod";

export const createBoardSchema = z.object({
  occasionKey: z.string().min(1),
  themeId: z.string().uuid(),
  recipientName: z.string().trim().min(1, "Recipient name is required").max(80),
  title: z.string().trim().min(1, "Title is required").max(120),
  headline: z.string().trim().max(200).optional(),
  mode: z.enum(["collaborative", "tribute"]),
  visibility: z.enum(["public", "unlisted", "private"]).default("public"),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
