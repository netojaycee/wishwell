"use client";

// Deletes the owner's account through Better Auth (user.deleteUser, see src/lib/auth.ts),
// whose beforeDelete hook removes all their boards and media first. Password accounts
// confirm with their password; Google accounts need a recent sign-in instead.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteAccount({ hasPassword, boardCount }: { hasPassword: boolean; boardCount: number }) {
  const router = useRouter();
  const [password, setPassword] = useState("");

  return (
    <ConfirmDialog
      triggerLabel="Delete my account"
      title="Delete your account?"
      description={
        <>
          Your account and all {boardCount} of your {boardCount === 1 ? "board" : "boards"}, with every
          message, photo and video on them, will be permanently deleted. This can&apos;t be undone.
        </>
      }
      confirmLabel="Delete everything"
      onConfirm={async () => {
        if (hasPassword && !password) return "Enter your password to confirm.";
        const { error } = await authClient.deleteUser(hasPassword ? { password } : {});
        if (error) {
          if (error.code === "INVALID_PASSWORD") return "That password isn't right.";
          if (error.code === "SESSION_EXPIRED")
            return "For your safety, please sign out and sign back in, then delete your account.";
          return "We couldn't delete your account. Please try again.";
        }
        router.push("/");
        router.refresh();
      }}
    >
      {hasPassword ? (
        <label className="block text-sm font-medium">
          Your password
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-xl border-2 border-black/10 bg-white px-4 py-3 text-base focus:border-[var(--brand)] focus:outline-none sm:text-sm"
          />
        </label>
      ) : null}
    </ConfirmDialog>
  );
}
