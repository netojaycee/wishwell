// Better Auth server instance. Only board OWNERS have accounts, contributors never authenticate.
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { env, hasGoogleAuth } from "@/lib/env";
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email";
import { deleteAllBoardsForOwner } from "@/lib/data/boards";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
    // "Forgot password": emails a one-hour link to /reset-password.
    sendResetPassword: async ({ user, url }) => {
      await sendPasswordResetEmail({ to: user.email, url });
    },
    revokeSessionsOnPasswordReset: true,
  },
  // Soft verification: sent on sign-up, not required to sign in (that would lock out every
  // account created before this existed). Unverified users get a banner with a resend link.
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail({ to: user.email, name: user.name, url });
    },
  },
  user: {
    // Owners can delete their account from /dashboard/settings. Their boards, posts and
    // every uploaded file go first, so nothing of theirs is left behind.
    deleteUser: {
      enabled: true,
      beforeDelete: async (user) => {
        await deleteAllBoardsForOwner(user.id);
      },
    },
  },
  socialProviders: hasGoogleAuth
    ? {
        google: {
          clientId: env.GOOGLE_CLIENT_ID!,
          clientSecret: env.GOOGLE_CLIENT_SECRET!,
        },
      }
    : undefined,
  session: {
    cookieCache: { enabled: true, maxAge: 5 * 60 },
  },
});

export type Session = typeof auth.$Infer.Session;
