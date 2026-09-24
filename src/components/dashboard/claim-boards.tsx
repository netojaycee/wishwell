"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { claimPendingBoards, claimWrittenPosts } from "@/lib/claim";

export function ClaimBoards({ ownerId }: { ownerId: string }) {
  const [claimed, setClaimed] = useState<string[] | null>(null);
  const router = useRouter();

  useEffect(() => {
    claimPendingBoards(ownerId).then((slugs) => {
      if (slugs.length > 0) {
        setClaimed(slugs);
        router.refresh();
      }
    });
    // Messages written from this browser while signed out now belong to the account too.
    claimWrittenPosts().then((count) => {
      if (count > 0) router.refresh();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, []);

  if (!claimed || claimed.length === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
      {claimed.length === 1 ? "A board you created is now" : `${claimed.length} boards you created are now`} linked
      to your account.
    </div>
  );
}
