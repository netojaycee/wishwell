import type { Metadata } from "next";
import { SplitShell } from "@/components/brand/split-shell";
import { ResetPasswordForm } from "@/components/auth/password-reset";

export const metadata: Metadata = { title: "Choose a new password", robots: { index: false, follow: false } };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; error?: string }>;
}) {
  const { token, error } = await searchParams;
  return (
    <SplitShell>
      <ResetPasswordForm token={token ?? null} invalid={Boolean(error)} />
    </SplitShell>
  );
}
