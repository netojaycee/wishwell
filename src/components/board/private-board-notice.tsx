// Shown instead of a private board to anyone who isn't its owner or an invitee. Calm and
// neutral on purpose: this can be a memorial page, so nothing playful, and it never
// reveals whose board it is.
import Link from "next/link";
import { Lock } from "lucide-react";
import { LogoMark } from "@/components/brand/logo-mark";
import { SiteFooter } from "@/components/marketing/site-footer";

export function PrivateBoardNotice({ slug }: { slug: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="px-6 py-5">
        <Link href="/" className="inline-flex items-center gap-2 font-heading text-lg" style={{ color: "var(--brand-ink)" }}>
          <LogoMark className="h-5 w-5 shrink-0" color="var(--brand)" />
          Fondly Held
        </Link>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
          <Lock size={26} strokeWidth={1.75} />
        </span>
        <h1 className="mt-6 font-heading text-3xl" style={{ color: "var(--brand-ink)" }}>
          This board is private
        </h1>
        <p className="mt-3 max-w-md leading-relaxed text-black/60">
          Only its owner and the people they&apos;ve invited can open it. If you were invited,
          open the link in your invite email on this device. If it&apos;s your board, sign in.
        </p>
        <Link
          href={`/sign-in?redirectTo=${encodeURIComponent(`/b/${slug}`)}`}
          className="mt-8 rounded-full bg-[var(--brand-ink)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand)]"
        >
          Sign in
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
