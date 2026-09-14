# Wishwell

Beautiful group cards and tribute pages for every occasion. See the root-level
`ARCHITECTURE.md`, `BUILD_PLAN.md`, and `DESIGN.md` (one directory up) for product context.

## Local development

Requires Node 20.9+ and pnpm, and a local Postgres instance (this project was built
against [DBngin](https://dbngin.com)).

```bash
# from this directory (app/)
pnpm install
pnpm db:migrate   # apply migrations to the DB in DATABASE_URL
pnpm db:seed      # seed the 10 occasion types + 3 themes each
pnpm dev
```

Copy `.env.example` to `.env.local` and fill in what you have — everything except
`DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, and `NEXT_PUBLIC_APP_URL` is
optional for local dev (media upload, GIF picker, Google sign-in, and email invites all
feature-detect and no-op cleanly until configured).

Useful scripts: `pnpm db:studio` (Drizzle Studio GUI), `pnpm db:generate` (new migration
after a schema change), `pnpm lint`, `pnpm build`.

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Import Project" from that repo and set **Root Directory to `app`**
   (the Next.js app lives in a subdirectory alongside the product docs).
3. Add the environment variables from `.env.example` in the Vercel project settings —
   at minimum `DATABASE_URL` (a Neon connection string), `BETTER_AUTH_SECRET` (any long
   random string), `BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` (your Vercel deployment
   URL, e.g. `https://your-project.vercel.app`).
4. Run `pnpm db:migrate` and `pnpm db:seed` once against the Neon database before or
   right after the first deploy (from your machine, with `DATABASE_URL` pointed at Neon) —
   Vercel's build step does not run migrations automatically.
5. Deploy. No custom domain is required — the `*.vercel.app` URL is fully functional.

If you later add a custom domain, update `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL` to
match, and re-check the Google OAuth redirect URI if that's configured.
