// Seeds the three example boards linked from the home page (BUILD_PLAN.md hour 8–9): one
// per motion profile — birthday (celebratory), farewell (warm), memorial (solemn).
// Honesty rules (GROWTH.md §3): each is visibly labelled an example in its headline and is
// UNLISTED — reachable from the home page, but noindexed and kept out of the sitemap and
// "recent boards", so they never pose as real customers' boards. They're owned by the
// founder account (EXAMPLE_OWNER_EMAIL, default below) so they can be moderated from the
// dashboard like any board. The memorial example uses only an archival photo and flowers —
// never a portrait of an identifiable living person presented as deceased.
// Idempotent: skips any example whose slug already exists. Run: `pnpm db:seed-demo`.
import { config } from "dotenv";
config({ path: ".env.local", quiet: true });

type DemoPostInput = { author: string; body: string; photo?: string; gif?: string };

// Extra posts beyond each showcase's three, so the examples feel lived-in.
const EXTRA_POSTS: Record<string, DemoPostInput[]> = {
  birthday: [
    { author: "Tolani", body: "Remember this day? I still laugh about it. Happy birthday, my friend!", photo: "friendsLaughing" },
    { author: "Sade", body: "Happy 30th, Tolu! Dinner is on me next week — no arguments." },
    { author: "Uncle Dayo", body: "Thirty years of making this family proud. Keep shining." },
  ],
  farewell: [
    { author: "Tunde", body: "Your desk plant is in safe hands, promise. Go and be brilliant.", photo: "farewellOffice" },
    { author: "Grace", body: "Best project partner I ever had. Lagos to London isn't that far.", photo: "workHighfive" },
    { author: "Ifeoma", body: "Thank you for every patient code review and every emergency snack." },
  ],
  memorial: [
    { author: "Mrs. Adebayo", body: "She taught half the street to bake. We still make her bread every Christmas." },
    { author: "Ruth", body: "Flowers from all of us at the choir. She never missed a Sunday.", photo: "thankyouFlowers" },
    { author: "Sam", body: "Rest well, Grandma. We'll look after each other the way you taught us." },
  ],
};

const HEADLINE = {
  tribute: "An example memorial page — made to show how Fondly Held holds a life's worth of memories.",
  collaborative: "An example board — made to show what yours could look like.",
};

async function main() {
  const { db } = await import("./index");
  const { board, post, occasionType, theme, user } = await import("./schema");
  const { eq } = await import("drizzle-orm");
  const { EXAMPLE_BOARD_KEYS, occasionShowcase, PHOTOS, GIFS } = await import("../lib/content/moments");

  const ownerEmail = process.env.EXAMPLE_OWNER_EMAIL || "netojaycee@gmail.com";
  const [owner] = await db.select({ id: user.id }).from(user).where(eq(user.email, ownerEmail));
  if (!owner) console.warn(`  ! No account for ${ownerEmail} — examples will be unowned (not moderatable).`);

  for (const key of EXAMPLE_BOARD_KEYS) {
    const showcase = occasionShowcase[key];
    const [existing] = await db
      .select({ id: board.id, ownerId: board.ownerId })
      .from(board)
      .where(eq(board.slug, showcase.slug));
    if (existing) {
      // Re-running after the founder signs up hands them the (unowned) examples to moderate.
      if (!existing.ownerId && owner) {
        await db.update(board).set({ ownerId: owner.id }).where(eq(board.id, existing.id));
        console.log(`  ✓ ${showcase.slug} already exists — now owned by ${ownerEmail}`);
      } else {
        console.log(`  – ${showcase.slug} already exists, skipping`);
      }
      continue;
    }

    const [occasion] = await db.select().from(occasionType).where(eq(occasionType.key, key));
    if (!occasion) throw new Error(`Occasion "${key}" not seeded — run pnpm db:seed first.`);
    const themes = await db.select().from(theme).where(eq(theme.occasionTypeId, occasion.id));
    const chosen = themes.find((t) => t.isDefault) ?? themes[0];
    if (!chosen) throw new Error(`No themes for "${key}".`);

    const mode = occasion.category === "tribute" ? "tribute" : "collaborative";
    const [created] = await db
      .insert(board)
      .values({
        ownerId: owner?.id ?? null,
        slug: showcase.slug,
        occasionTypeId: occasion.id,
        mode,
        recipientName: showcase.recipient,
        title: showcase.title,
        headline: HEADLINE[mode],
        themeId: chosen.id,
        visibility: "unlisted",
        meta: { example: true },
      })
      .returning();

    const posts: DemoPostInput[] = [...showcase.posts, ...EXTRA_POSTS[key]];
    const now = Date.now();
    for (const [i, p] of posts.entries()) {
      const photo = p.photo ? PHOTOS[p.photo as keyof typeof PHOTOS] : undefined;
      const gif = p.gif ? GIFS[p.gif as keyof typeof GIFS] : undefined;
      await db.insert(post).values({
        boardId: created.id,
        authorName: p.author,
        body: p.body,
        mediaType: photo ? "image" : gif ? "gif" : "none",
        mediaUrl: photo?.src ?? null,
        gifUrl: gif?.src ?? null,
        status: "published",
        authorIpHash: "seed:example-board",
        // Staggered a few hours apart, oldest first, so ordering looks natural.
        createdAt: new Date(now - (posts.length - i) * 3 * 60 * 60 * 1000),
      });
    }

    console.log(`  ✓ /b/${showcase.slug} (${posts.length} posts, unlisted${owner ? ", owned by founder" : ""})`);
  }

  console.log("Example boards ready.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
