"use client";

// "Forgot password" flow for email/password owners: request a link (/forgot-password),
// then choose a new password from it (/reset-password?token=…). Better Auth does the
// token work; see sendResetPassword in src/lib/auth.ts.
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Mail } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues,
} from "@/lib/validation/auth";

const SHELL =
  "flex items-center gap-3 rounded-xl border bg-white px-4 py-3 transition-colors focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/15";
const INPUT = "w-full bg-transparent text-[15px] outline-none placeholder:text-black/35";
const BUTTON =
  "w-full rounded-full bg-[var(--brand-ink)] px-6 py-3 text-sm font-semibold text-white transition-transform enabled:hover:scale-[1.02] disabled:opacity-60";

function FieldError({ message }: { message?: string }) {
  return message ? (
    <p role="alert" className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  ) : null;
}

export function ForgotPasswordForm({ initialEmail = "" }: { initialEmail?: string }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: initialEmail } });

  const onSubmit = async ({ email }: ForgotPasswordValues) => {
    setError(null);
    const { error } = await authClient.requestPasswordReset({ email, redirectTo: "/reset-password" });
    // Same message whether or not the account exists, so this can't be used to probe emails.
    if (error && error.status !== 400) {
      setError("We couldn't send the email just now. Please try again in a minute.");
      return;
    }
    setSent(true);
  };

  return (
    <div>
      <h1 className="font-heading text-3xl" style={{ color: "var(--brand-ink)" }}>
        Reset your password
      </h1>
      {sent ? (
        <>
          <p className="mt-3 leading-relaxed text-black/60">
            If there&apos;s an account for that email, a link to choose a new password is on its way.
            It works for one hour. Check your spam folder if it doesn&apos;t arrive in a few minutes.
          </p>
          <Link href="/sign-in" className="mt-8 inline-block text-sm font-medium" style={{ color: "var(--brand)" }}>
            Back to sign in
          </Link>
        </>
      ) : (
        <>
          <p className="mt-2 text-sm text-black/50">Enter your account email and we&apos;ll send you a link.</p>
          <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3.5">
            <div>
              <div className={`${SHELL} ${errors.email ? "border-red-400" : "border-black/10"}`}>
                <Mail size={18} strokeWidth={1.75} className="text-black/35" />
                <input
                  {...register("email")}
                  type="email"
                  autoComplete="email"
                  aria-label="Email"
                  aria-invalid={Boolean(errors.email)}
                  placeholder="you@example.com"
                  className={INPUT}
                />
              </div>
              <FieldError message={errors.email?.message} />
            </div>
            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
            <button type="submit" disabled={isSubmitting} className={BUTTON}>
              {isSubmitting ? "Sending…" : "Send reset link"}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-black/50">
            Remembered it?{" "}
            <Link href="/sign-in" className="font-medium" style={{ color: "var(--brand)" }}>
              Sign in
            </Link>
          </p>
        </>
      )}
    </div>
  );
}

export function ResetPasswordForm({ token, invalid }: { token: string | null; invalid: boolean }) {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({ resolver: zodResolver(resetPasswordSchema), defaultValues: { password: "", confirm: "" } });

  if (!token || invalid) {
    return (
      <div>
        <h1 className="font-heading text-3xl" style={{ color: "var(--brand-ink)" }}>
          This link has expired
        </h1>
        <p className="mt-3 leading-relaxed text-black/60">
          Reset links work once, for one hour. Ask for a fresh one and use the newest email.
        </p>
        <Link href="/forgot-password" className={`${BUTTON} mt-8 inline-block text-center`}>
          Send a new link
        </Link>
      </div>
    );
  }

  const onSubmit = async ({ password }: ResetPasswordValues) => {
    setError(null);
    const { error } = await authClient.resetPassword({ newPassword: password, token });
    if (error) {
      setError(
        error.code === "INVALID_TOKEN"
          ? "This link has expired. Please ask for a new one."
          : "We couldn't change your password. Please try again."
      );
      return;
    }
    setDone(true);
  };

  if (done) {
    return (
      <div>
        <h1 className="font-heading text-3xl" style={{ color: "var(--brand-ink)" }}>
          Password changed
        </h1>
        <p className="mt-3 text-black/60">You&apos;ve been signed out everywhere else. Sign in with your new password.</p>
        <Link href="/sign-in" className={`${BUTTON} mt-8 inline-block text-center`}>
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-heading text-3xl" style={{ color: "var(--brand-ink)" }}>
        Choose a new password
      </h1>
      <p className="mt-2 text-sm text-black/50">At least 8 characters.</p>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-3.5">
        {(["password", "confirm"] as const).map((name) => (
          <div key={name}>
            <div className={`${SHELL} ${errors[name] ? "border-red-400" : "border-black/10"}`}>
              <Lock size={18} strokeWidth={1.75} className="text-black/35" />
              <input
                {...register(name)}
                type="password"
                autoComplete="new-password"
                aria-label={name === "password" ? "New password" : "Confirm new password"}
                aria-invalid={Boolean(errors[name])}
                placeholder={name === "password" ? "New password" : "Type it again"}
                className={INPUT}
              />
            </div>
            <FieldError message={errors[name]?.message} />
          </div>
        ))}
        {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p> : null}
        <button type="submit" disabled={isSubmitting} className={BUTTON}>
          {isSubmitting ? "Saving…" : "Save new password"}
        </button>
      </form>
    </div>
  );
}
