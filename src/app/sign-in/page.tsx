import type { Metadata } from "next";
import { hasGoogleAuth } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";
import { SplitShell } from "@/components/brand/split-shell";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return (
    <SplitShell>
      <AuthForm mode="sign-in" hasGoogleAuth={hasGoogleAuth} />
    </SplitShell>
  );
}
