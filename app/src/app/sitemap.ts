import type { MetadataRoute } from "next";
import { db } from "@/db";
import { board, occasionType } from "@/db/schema";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = env.NEXT_PUBLIC_APP_URL;

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/create`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const occasions = await db.select({ key: occasionType.key }).from(occasionType);
  const occasionPages: MetadataRoute.Sitemap = occasions.map((o) => ({
    url: `${base}/occasions/${o.key}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const publicBoards = await db
    .select({ slug: board.slug, updatedAt: board.updatedAt })
    .from(board)
    .where(eq(board.visibility, "public"));
  const boardPages: MetadataRoute.Sitemap = publicBoards.map((b) => ({
    url: `${base}/b/${b.slug}`,
    lastModified: b.updatedAt,
    changeFrequency: "daily",
    priority: 0.5,
  }));

  return [...staticPages, ...occasionPages, ...boardPages];
}
