import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b border-black/5">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <Link href="/" className="font-heading text-xl">
          Fondly Held
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/create" className="hidden sm:inline">
            Create a board
          </Link>
          <Link href="/sign-in">Sign in</Link>
          <Link
            href="/create"
            className="rounded-full bg-black px-4 py-2 text-white"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
