import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[var(--background)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-2.5 font-heading text-xl">
          <LogoMark className="h-6 w-6 shrink-0" color="var(--brand)" />
          Fondly Held
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/create" className="hidden sm:inline">
            Create a board
          </Link>
          <Link href="/sign-in">Sign in</Link>
          <Link
            href="/create"
            className="rounded-full bg-[var(--brand-ink)] px-4 py-2 text-white transition-colors hover:bg-[var(--brand)]"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
