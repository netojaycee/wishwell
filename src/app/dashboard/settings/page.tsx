import Link from "next/link";
import type { Metadata } from "next";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { account } from "@/db/schema";
import { requireSession } from "@/lib/session";
import { listBoardsForOwner } from "@/lib/data/boards";
import { DeleteAccount } from "@/components/dashboard/delete-account";
import { initialsFor } from "@/lib/initials";

export const metadata: Metadata = { title: "Account settings" };

export default async function AccountSettingsPage() {
  const session = await requireSession();
  const [credential] = await db
    .select({ id: account.id })
    .from(account)
    .where(and(eq(account.userId, session.user.id), eq(account.providerId, "credential")));
  const boards = await listBoardsForOwner(session.user.id);
  const { user } = session;

  return (
    <div className="max-w-xl">
      <Link href="/dashboard" className="text-sm text-black/50 hover:text-black">
        ← My boards
      </Link>
      <h1 className="mt-2 font-heading text-3xl">Account settings</h1>

      <section className="mt-8 flex items-center gap-4 rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar from the provider's CDN
          <img src={user.image} alt="" referrerPolicy="no-referrer" className="h-14 w-14 rounded-full object-cover" />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-ink)] text-lg font-semibold text-white">
            {initialsFor(user)}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">{user.name}</p>
          <p className="truncate text-sm text-black/55">{user.email}</p>
          <p className="mt-1 text-xs text-black/40">
            {credential ? "Signs in with email and password" : "Signs in with Google"}
          </p>
        </div>
      </section>

      {credential ? (
        <section className="mt-6 rounded-2xl border border-black/10 bg-white/70 p-5 shadow-sm">
          <h2 className="font-heading text-lg">Password</h2>
          <p className="mt-1 text-sm text-black/55">We&apos;ll email you a link to choose a new one.</p>
          <Link
            href={`/forgot-password?email=${encodeURIComponent(user.email)}`}
            className="mt-3 inline-flex rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:border-black/20"
          >
            Reset my password
          </Link>
        </section>
      ) : null}

      <section className="mt-6 rounded-2xl border border-red-100 bg-white/70 p-5 shadow-sm">
        <h2 className="font-heading text-lg">Delete account</h2>
        <p className="mt-1 mb-4 text-sm leading-relaxed text-black/55">
          Permanently deletes your account and all of your boards, including every message, photo
          and video on them. Nothing is kept.
        </p>
        <DeleteAccount hasPassword={Boolean(credential)} boardCount={boards.length} />
      </section>
    </div>
  );
}
