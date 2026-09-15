import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { HeaderAuth } from "./header-auth";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-black/5 bg-[var(--background)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
        {/* whitespace-nowrap: at 375px the brand and nav used to wrap onto two lines each. */}
        <Link href="/" className="flex items-center gap-2 font-heading text-lg whitespace-nowrap sm:gap-2.5 sm:text-xl">
          <LogoMark className="h-6 w-6 shrink-0" color="var(--brand)" />
          Fondly Held
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium whitespace-nowrap sm:gap-6">
          <HeaderAuth />
        </nav>
      </div>
    </header>
  );
}
