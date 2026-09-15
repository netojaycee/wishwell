import type { Metadata } from "next";
import { hasGoogleAuth } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <AuthShell>
      <AuthForm mode="sign-in" hasGoogleAuth={hasGoogleAuth} />
    </AuthShell>
  );
}
