import type { Metadata } from "next";
import { listOccasionsWithThemes } from "@/lib/data/occasions";
import { CreateWizard } from "@/components/create/create-wizard";
import { hasR2 } from "@/lib/env";
import { SiteFooter } from "@/components/marketing/site-footer";

export const metadata: Metadata = {
  title: "Create a board",
  description: "Start a free group card or tribute page in under a minute, no signup required.",
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string }>;
}) {
  const { occasion } = await searchParams;
  const occasions = await listOccasionsWithThemes();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-[var(--background)]">
      <div className="flex-1">
        <CreateWizard occasions={occasions} initialOccasionKey={occasion} mediaEnabled={hasR2} />
      </div>
      <SiteFooter />
    </div>
  );
}
