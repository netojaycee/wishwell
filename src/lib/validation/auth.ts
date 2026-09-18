// Sign-in / sign-up field rules for the owner auth form (contributors never need these).
import { z } from "zod";

const email = z.string().trim().min(1, "Enter your email address.").email("That doesn't look like an email address.");

export const signInSchema = z.object({
  name: z.string(), // unused on sign-in; kept so both schemas share one form shape
  email,
  password: z.string().min(1, "Enter your password."),
});

export const signUpSchema = z.object({
  name: z.string().trim().min(1, "Tell us your name.").max(80, "Please keep your name under 80 characters."),
  email,
  password: z
    .string()
    .min(8, "Use at least 8 characters for your password.")
    .max(128, "Please keep your password under 128 characters."),
});

export type AuthValues = z.infer<typeof signUpSchema>;
