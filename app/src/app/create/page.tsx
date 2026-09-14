import type { Metadata } from "next";
import { listOccasionsWithThemes } from "@/lib/data/occasions";
import { CreateWizard } from "@/components/create/create-wizard";

export const metadata: Metadata = {
  title: "Create a board",
  description: "Start a free group card or tribute page in under a minute — no signup required.",
};

export default async function CreatePage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string }>;
}) {
  const { occasion } = await searchParams;
  const occasions = await listOccasionsWithThemes();

  return <CreateWizard occasions={occasions} initialOccasionKey={occasion} />;
}
