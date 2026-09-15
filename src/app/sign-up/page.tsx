import type { Metadata } from "next";
import { hasGoogleAuth } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";
import { SplitShell } from "@/components/brand/split-shell";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <SplitShell>
      <AuthForm mode="sign-up" hasGoogleAuth={hasGoogleAuth} />
    </SplitShell>
  );
}
