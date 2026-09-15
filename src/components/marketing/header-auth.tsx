"use client";

// Auth-aware right side of the marketing header. Client-side on purpose: reading the
// session on the server would make every marketing page dynamic and throw away their
// static/ISR caching (home + occasion pages are the SEO surface). While the session is
// loading, the signed-out links render invisibly to hold the layout, so a signed-in owner
// never sees a flash of "Sign in".
import Link from "next/link";
import { useSession } from "@/lib/auth-client";

const PILL =
  "rounded-full bg-[var(--brand-ink)] px-4 py-2 text-white transition-colors hover:bg-[var(--brand)]";

export function HeaderAuth() {
  const { data: session, isPending } = useSession();

  if (session) {
    return (
      <>
        <Link href="/dashboard" className="hover:text-[var(--brand)]">
          My boards
        </Link>
        <Link href="/create" className={PILL}>
          New board
        </Link>
      </>
    );
  }

  return (
    <span className={`contents ${isPending ? "[&>*]:invisible" : ""}`} aria-hidden={isPending || undefined}>
      <Link href="/create" className="hidden hover:text-[var(--brand)] sm:inline">
        Create a board
      </Link>
      <Link href="/sign-in" className="hover:text-[var(--brand)]">
        Sign in
      </Link>
      <Link href="/create" className={PILL}>
        Get started
      </Link>
    </span>
  );
}
