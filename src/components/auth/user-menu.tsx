"use client";

// The signed-in owner's profile menu: avatar (photo or initials) + chevron, opening a
// dropdown with who's signed in, shortcuts, and sign out. Used by the dashboard and the
// marketing header so an owner sees the same control everywhere.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "@base-ui/react/menu";
import { ChevronDown, LayoutGrid, LogOut, Plus } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type MenuUser = { name?: string | null; email: string; image?: string | null };

export function initialsFor(user: MenuUser) {
  const source = user.name?.trim() || user.email.split("@")[0];
  const parts = source.split(/[\s._-]+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : source.slice(0, 2);
  return letters.toUpperCase();
}

function Avatar({ user, className = "" }: { user: MenuUser; className?: string }) {
  return user.image ? (
    // eslint-disable-next-line @next/next/no-img-element -- OAuth avatar from the provider's CDN
    <img src={user.image} alt="" referrerPolicy="no-referrer" className={`rounded-full object-cover ${className}`} />
  ) : (
    <span
      aria-hidden
      className={`flex items-center justify-center rounded-full bg-[var(--brand-ink)] font-semibold text-white ${className}`}
    >
      {initialsFor(user)}
    </span>
  );
}

const ITEM =
  "flex cursor-default items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-black/75 outline-none select-none data-highlighted:bg-[var(--brand-soft)] data-highlighted:text-[var(--brand-ink)]";

export function UserMenu({ user }: { user: MenuUser }) {
  const router = useRouter();

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Account menu"
        className="flex items-center gap-1.5 rounded-full border border-black/10 bg-white/80 py-1 pr-2 pl-1 transition-colors hover:border-black/20 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand)] data-popup-open:border-[var(--brand)]/40 data-popup-open:bg-white"
      >
        <Avatar user={user} className="h-7 w-7 text-[11px]" />
        <ChevronDown
          size={14}
          strokeWidth={2.25}
          className="text-black/45 transition-transform duration-200 in-data-popup-open:rotate-180 motion-reduce:transition-none"
        />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={8} align="end" className="z-50 outline-none">
          <Menu.Popup className="w-64 origin-[var(--transform-origin)] rounded-2xl border border-black/5 bg-white p-1.5 shadow-xl shadow-black/10 outline-none transition-[scale,opacity] duration-150 ease-out data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
            <div className="flex items-center gap-3 px-3 pt-2.5 pb-3">
              <Avatar user={user} className="h-10 w-10 shrink-0 text-sm" />
              <div className="min-w-0">
                {user.name ? <p className="truncate text-sm font-medium text-[var(--brand-ink)]">{user.name}</p> : null}
                <p className="truncate text-xs text-black/50">{user.email}</p>
              </div>
            </div>
            <Menu.Separator className="mx-1.5 mb-1.5 h-px bg-black/5" />
            <Menu.LinkItem className={ITEM} render={<Link href="/dashboard" />}>
              <LayoutGrid size={16} strokeWidth={1.75} /> My boards
            </Menu.LinkItem>
            <Menu.LinkItem className={ITEM} render={<Link href="/create" />}>
              <Plus size={16} strokeWidth={1.75} /> New board
            </Menu.LinkItem>
            <Menu.Separator className="mx-1.5 my-1.5 h-px bg-black/5" />
            <Menu.Item className={ITEM} onClick={signOut}>
              <LogOut size={16} strokeWidth={1.75} /> Sign out
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
