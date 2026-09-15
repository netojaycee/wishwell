import Link from "next/link";
import { requireSession } from "@/lib/session";
import { SignOutButton } from "@/components/auth/sign-out-button";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link href="/dashboard" className="font-heading text-lg">
            Fondly Held
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-black/50">{session.user.email}</span>
            <Link href="/create" className="font-medium underline underline-offset-2">
              New board
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
    </div>
  );
}
