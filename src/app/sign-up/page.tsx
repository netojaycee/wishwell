import type { Metadata } from "next";
import { hasGoogleAuth } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return <AuthForm mode="sign-up" hasGoogleAuth={hasGoogleAuth} />;
}
