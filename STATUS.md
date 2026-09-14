# STATUS.md — Wishwell

> Living file. The agent updates this after every meaningful change. Keep it short and true. Delete finished noise; this is a state file, not a changelog.

**Last updated:** 2026-09-14
**Phase:** Day-1 build — core vertical slice working, moving through remaining Hours
**Live URL:** _(pending — not yet deployed to Vercel)_
**Repo:** local git only, no GitHub remote yet

## Now
- [ ] Owner auth + dashboard (sign in, moderate posts, claim guest boards) — Hour 6-7
- [ ] Marketing home page (still the create-next-app placeholder)
- [ ] `/occasions/[key]` SEO landing pages — Hour 7-8
- [ ] sitemap.xml, robots.txt, JSON-LD, dynamic OG images — Hour 7-8
- [ ] Slideshow mode `/b/[slug]/slideshow`
- [ ] Push to GitHub + connect Vercel project (needs the user's accounts)

## Done
- Next.js 16 (App Router, Turbopack, Tailwind v4) scaffolded in `app/`, shadcn/ui initialized
- Drizzle schema for Board/OccasionType/Theme/Post/Reaction/Invite/Report + Better Auth's own tables
- Local dev DB: DBngin Postgres, database `wishwell_dev`, migrations applied
- Seeded 10 occasion types x 3 themes each with real editorial palettes (not placeholders)
- `/create` wizard: occasion -> recipient/title/headline -> theme -> done, creates a board
  as a guest via a Server Action (no account needed), sets a claim-token cookie
- `/b/[slug]`: ISR board page (revalidate 60), themed hero, live counter, masonry post
  grid, empty state, motion-profile-aware ambient layer. **Verified in-browser**: celebratory
  fires confetti, memorial (solemn) never does — checked visually, not just by reading code
- `/b/[slug]/post`: anonymous posting (name/message/photo/video/GIF), Postgres-backed rate
  limit (5/board/hr, 20/day global per IP-hash), honeypot + timing bot check, HTML sanitized
- Media (R2 presigned upload) and GIF (Giphy proxy) both feature-detect and no-op cleanly
  until those API keys are supplied — rest of the app doesn't block on them
- `pnpm lint` and `tsc --noEmit` both clean

## Blocked / needs a human decision
- [ ] Neon project + connection string (building against local Postgres meanwhile)
- [ ] Vercel account — need `vercel login` or a dashboard import to actually deploy
- [ ] GitHub repo to push to (or deploy straight from local via Vercel CLI)
- [ ] R2 bucket + keys (media uploads are stubbed out until then)
- [ ] Resend API key + domain (needed for real invite/magic-link email delivery — sandbox
  mode only sends to the account owner's own address without a verified domain)
- [ ] Google OAuth client (email/password auth works without it)
- [ ] Giphy API key (free, developers.giphy.com)
- [ ] No domain yet — shipping on the Vercel-provided `*.vercel.app` URL is fully functional;
  see chat for the Hobby-plan-is-non-commercial caveat

## Environment
```
DATABASE_URL=postgresql://postgres@127.0.0.1:5432/wishwell_dev   # local (DBngin); Neon URL in prod
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
R2_PUBLIC_URL=
RESEND_API_KEY=
GIPHY_API_KEY=
NEXT_PUBLIC_APP_URL=
```
See `app/.env.example` for the authoritative list.

## Known issues
- Dev mode (Turbopack) shows a multi-second delay compiling a route's client chunk on
  first visit — a page/step can sit at near-zero opacity briefly before its transition
  plays. Confirmed this is dev-only compilation lag, not a production issue.
- `/dashboard` (owner moderation) doesn't exist yet — until it ships, hiding/deleting
  posts and editing a board after creation isn't possible.

## Deferred (parked deliberately — do not pull forward without a decision)
payments · print export · Slack/Teams · gifting · per-account custom domains · threaded comments · scheduled delivery · multi-admin · owner analytics · public API
