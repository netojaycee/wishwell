"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode, hasGoogleAuth }: { mode: "sign-in" | "sign-up"; hasGoogleAuth: boolean }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-sm px-6 py-20">
      <h1 className="font-heading text-3xl">{mode === "sign-up" ? "Create your account" : "Welcome back"}</h1>
      <p className="mt-2 text-sm text-black/50">
        {mode === "sign-up" ? "Manage your boards and moderate posts." : "Sign in to manage your boards."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        {mode === "sign-up" ? (
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-[15px]"
            />
          </div>
        ) : null}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-[15px]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-4 py-3 text-[15px]"
          />
        </div>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {submitting ? "Please wait…" : mode === "sign-up" ? "Create account" : "Sign in"}
        </button>
      </form>

      {hasGoogleAuth ? (
        <button
          onClick={() => authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })}
          className="mt-3 w-full rounded-full border border-black/10 px-6 py-3 text-sm font-semibold"
        >
          Continue with Google
        </button>
      ) : null}

      <p className="mt-6 text-center text-sm text-black/50">
        {mode === "sign-up" ? (
          <>
            Already have an account? <Link href="/sign-in" className="font-medium underline">Sign in</Link>
          </>
        ) : (
          <>
            New here? <Link href="/sign-up" className="font-medium underline">Create an account</Link>
          </>
        )}
      </p>
    </div>
  );
}
