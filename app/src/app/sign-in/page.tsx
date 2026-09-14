import type { Metadata } from "next";
import { hasGoogleAuth } from "@/lib/env";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Sign in" };

export default function SignInPage() {
  return <AuthForm mode="sign-in" hasGoogleAuth={hasGoogleAuth} />;
}
