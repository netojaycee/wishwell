import type { Metadata } from "next";
import { hasGoogleAuth } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <AuthShell>
      <AuthForm mode="sign-up" hasGoogleAuth={hasGoogleAuth} />
    </AuthShell>
  );
}
