import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-[var(--brand-soft)]/40">
      <div className="mx-auto max-w-6xl px-6 py-14 sm:flex sm:items-start sm:justify-between sm:gap-12">
        <div className="max-w-sm">
          <Link href="/" className="flex items-center gap-2 font-heading text-lg">
            <LogoMark className="h-5 w-5 shrink-0" color="var(--brand)" />
            Fondly Held
          </Link>
          <p className="mt-4 text-sm text-black/60">
            Your board is yours forever. We never sell your data, and you can delete
            anything you&apos;ve posted at any time.
          </p>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-black/50 sm:mt-0">
          <Link href="/about" className="hover:text-[var(--brand)]">About</Link>
          <Link href="/privacy" className="hover:text-[var(--brand)]">Privacy</Link>
          <Link href="/terms" className="hover:text-[var(--brand)]">Terms</Link>
          <Link href="/contact" className="hover:text-[var(--brand)]">Contact</Link>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 border-t border-black/5 px-6 py-4 text-center text-xs text-black/30 sm:flex-row sm:justify-center sm:gap-3">
        <span>© {new Date().getFullYear()} Fondly Held.</span>
        <span className="hidden sm:inline" aria-hidden>·</span>
        <span>
          Photos from{" "}
          <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black/60">
            Unsplash
          </a>{" "}
          · GIFs via{" "}
          <a href="https://giphy.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-black/60">
            GIPHY
          </a>
        </span>
      </div>
    </footer>
  );
}
