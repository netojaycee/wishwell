import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { occasionType, theme } from "@/db/schema";

export async function listOccasionTypes() {
  return db.select().from(occasionType).orderBy(asc(occasionType.label));
}

export async function listOccasionsWithThemes() {
  return db.query.occasionType.findMany({
    with: { themes: true },
    orderBy: asc(occasionType.label),
  });
}

export async function getOccasionByKey(key: string) {
  const [row] = await db.select().from(occasionType).where(eq(occasionType.key, key));
  return row ?? null;
}

export async function getThemesForOccasion(occasionTypeId: string) {
  return db
    .select()
    .from(theme)
    .where(eq(theme.occasionTypeId, occasionTypeId))
    .orderBy(asc(theme.name));
}

export async function getTheme(themeId: string) {
  const [row] = await db.select().from(theme).where(eq(theme.id, themeId));
  return row ?? null;
}
