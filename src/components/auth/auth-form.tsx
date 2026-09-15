"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { track } from "@/lib/analytics";
import { safeRedirect } from "@/lib/redirect";

// Where to go after signing in: back to the page proxy.ts bounced them from
// (?redirectTo=…), else the dashboard. Read at call time, not render time, so this
// statically rendered page doesn't need a Suspense boundary for useSearchParams.
function nextPath() {
  return safeRedirect(new URLSearchParams(window.location.search).get("redirectTo")) ?? "/dashboard";
}

function FieldShell({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 transition-colors focus-within:border-[var(--brand)] focus-within:ring-2 focus-within:ring-[var(--brand)]/15">
      <span className="text-black/35">{icon}</span>
      {children}
    </div>
  );
}

export function AuthForm({ mode, hasGoogleAuth }: { mode: "sign-in" | "sign-up"; hasGoogleAuth: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result =
      mode === "sign-up"
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });

    setSubmitting(false);

    if (result.error) {
      setError(result.error.message ?? "Something went wrong.");
      return;
    }

    if (mode === "sign-up") track("owner_signed_up", { method: "email" });
    router.push(nextPath());
    router.refresh();
  };

  return (
    <div>
      <h1 className="font-heading text-3xl" style={{ color: "var(--brand-ink)" }}>
        {mode === "sign-up" ? "Create your account" : "Welcome back"}
      </h1>
      <p className="mt-2 text-sm text-black/50">
        {mode === "sign-up" ? "Manage your boards and moderate posts." : "Sign in to manage your boards."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-3.5">
        {mode === "sign-up" ? (
          <FieldShell icon={<User size={18} strokeWidth={1.75} />}>
            <input
              required
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-black/35"
            />
          </FieldShell>
        ) : null}

        <FieldShell icon={<Mail size={18} strokeWidth={1.75} />}>
          <input
            required
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-black/35"
          />
        </FieldShell>

        <FieldShell icon={<Lock size={18} strokeWidth={1.75} />}>
          <input
            required
            type={showPassword ? "text" : "password"}
            minLength={8}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-black/35"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="shrink-0 text-black/35 hover:text-black/60"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
          </button>
        </FieldShell>

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full px-6 py-3 text-sm font-semibold text-white transition-transform disabled:opacity-60 enabled:hover:scale-[1.02]"
          style={{ background: "var(--brand-ink)" }}
        >
          {submitting ? "Please wait…" : mode === "sign-up" ? "Create account" : "Sign in"}
        </button>
      </form>

      {hasGoogleAuth ? (
        <>
          <div className="my-5 flex items-center gap-3 text-xs text-black/35">
            <span className="h-px flex-1 bg-black/10" />
            or
            <span className="h-px flex-1 bg-black/10" />
          </div>
          <button
            onClick={() => authClient.signIn.social({ provider: "google", callbackURL: nextPath() })}
            className="flex w-full items-center justify-center gap-2.5 rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-semibold transition-colors hover:bg-black/[0.02]"
          >
            <GoogleG />
            Continue with Google
          </button>
        </>
      ) : null}

      <p className="mt-8 text-center text-sm text-black/50">
        {mode === "sign-up" ? (
          <>
            Already have an account?{" "}
            <Link href="/sign-in" className="font-medium" style={{ color: "var(--brand)" }}>
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link href="/sign-up" className="font-medium" style={{ color: "var(--brand)" }}>
              Create an account
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.6 15.8 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.5 6 29.5 4 24 4c-7.6 0-14.1 4.3-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-1.8 14-4.9l-6.5-5.5c-2 1.4-4.6 2.4-7.5 2.4-5.3 0-9.7-3.1-11.3-7.9l-6.6 5.1C9.8 39.6 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.5 5.5C39.8 37 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}
