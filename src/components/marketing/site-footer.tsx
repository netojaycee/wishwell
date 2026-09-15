import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/5 bg-neutral-50">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="max-w-md text-sm text-black/60">
          Your board is yours forever. We never sell your data, and you can delete anything
          you&apos;ve posted at any time.
        </p>
        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-black/50">
          <Link href="/about">About</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </div>
        <p className="mt-6 text-xs text-black/30">© {new Date().getFullYear()} Fondly Held.</p>
      </div>
    </footer>
  );
}
