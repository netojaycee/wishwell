import type { Metadata } from "next";
import { SplitShell } from "@/components/brand/split-shell";
import { ForgotPasswordForm } from "@/components/auth/password-reset";

export const metadata: Metadata = { title: "Reset your password", robots: { index: false, follow: false } };

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
  const { email } = await searchParams;
  return (
    <SplitShell>
      <ForgotPasswordForm initialEmail={email ?? ""} />
    </SplitShell>
  );
}
