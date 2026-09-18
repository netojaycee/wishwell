import Link from "next/link";
import { requireSession } from "@/lib/session";
import { UserMenu } from "@/components/auth/user-menu";
import { SiteFooter } from "@/components/marketing/site-footer";
import { LogoMark } from "@/components/brand/logo-mark";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--background)]">
      {/* Soft brand wash behind the header area, the owner side should feel like the
          same warm product, not a grey admin panel. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80"
        style={{
          background:
            "radial-gradient(50% 60% at 10% 0%, rgba(196,113,63,0.10), transparent), radial-gradient(40% 50% at 95% 10%, rgba(242,228,188,0.45), transparent)",
        }}
      />
      <header className="relative border-b border-black/5 bg-[var(--background)]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-heading text-lg" style={{ color: "var(--brand-ink)" }}>
            <LogoMark className="h-5 w-5 shrink-0" color="var(--brand)" />
            Fondly Held
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/create"
              className="rounded-full bg-[var(--brand-ink)] px-4 py-2 font-medium text-white transition-colors hover:bg-[var(--brand)]"
            >
              New board
            </Link>
            <UserMenu user={{ name: session.user.name, email: session.user.email, image: session.user.image }} />
          </div>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-4xl flex-1 px-6 py-10">{children}</main>
      <SiteFooter />
    </div>
  );
}
