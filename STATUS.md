# STATUS.md — Wishwell

> Living file. The agent updates this after every meaningful change. Keep it short and true. Delete finished noise; this is a state file, not a changelog.

**Last updated:** 2026-09-14
**Phase:** Day-1 build — functionally complete end to end, not yet deployed
**Live URL:** _(pending — not yet deployed to Vercel)_
**Repo:** local git only (6 commits), no GitHub remote yet

## Now
- [ ] Push to GitHub + import into Vercel (needs the user's accounts — see Blocked)
- [ ] Seed 3 real demo boards with real content, once the app is live somewhere shareable
- [ ] Lighthouse pass on the board page once deployed (can't meaningfully test prod
  performance against local dev/Turbopack)

## Done
Everything in `BUILD_PLAN.md` Hours 0-8 except the items above. Concretely:
- Next.js 16 (App Router, Turbopack, Tailwind v4) in `app/`, shadcn/ui initialized
- Drizzle schema for Board/OccasionType/Theme/Post/Reaction/Invite/Report + Better Auth's
  own tables; local dev DB is DBngin Postgres (`wishwell_dev`), migrations applied
- Seeded 10 occasion types x 3 themes each with real editorial palettes
- `/create` wizard (guest, no account) -> `/b/[slug]` themed board page -> `/b/[slug]/post`
  anonymous contribution flow, all **verified end-to-end in-browser**, including that
  memorial (solemn) boards never fire confetti while celebratory ones do
- Owner auth (email/password + optional Google), `/dashboard` board list, `/dashboard/b/[slug]`
  moderation (hide/unhide/pin/delete posts, edit title/headline/visibility, invite by
  email, copy share link). Guest-created boards auto-claim to the owner's account on
  first dashboard visit after signing up — verified in-browser
- Marketing home page, all 10 `/occasions/[key]` SEO pages (statically generated, real
  ~300+ word copy, FAQ + JSON-LD, live recent-boards), sitemap.xml, robots.txt,
  Organization/WebSite JSON-LD, dynamic per-board OG image
- About/Privacy/Terms/Contact pages with real (non-lorem) content — two TODOs left for
  the user: swap in a real name/photo on About, and get Privacy/Terms reviewed by a
  lawyer before commercial launch
- `/b/[slug]/slideshow`: fullscreen autoplay, Ken Burns + cross-fade, keyboard nav
- Rate limiting (Postgres-backed, no Redis dependency), honeypot + timing bot check,
  HTML sanitization on all anonymous input, hashed (not raw) IPs
- Media (R2 presigned upload) and GIF (Giphy proxy) feature-detect and no-op cleanly
  until those keys are supplied — nothing else in the app blocks on them
- `pnpm lint`, `tsc --noEmit`, and `pnpm build` (production) all clean; checked mobile
  layout in-browser at a sub-`sm`-breakpoint width (couldn't force exactly 375px through
  the browser automation tool in this environment, but the same mobile-first CSS path
  applies at any width below 640px)

## Blocked / needs a human decision
- [ ] Neon project + connection string (building against local Postgres meanwhile; both
  are plain Postgres so switching is just an env var)
- [ ] Vercel account — need `vercel login` or a dashboard import to actually deploy
- [ ] GitHub repo to push to
- [ ] R2 bucket + keys (media uploads stubbed out until then)
- [ ] Resend API key + a verified sending domain (sandbox mode only sends to the
  account owner's own address — invite emails won't reach real people without this)
- [ ] Google OAuth client (email/password auth works without it)
- [ ] Giphy API key (free, developers.giphy.com)
- [ ] No domain yet — shipping on the Vercel-provided `*.vercel.app` URL is fully
  functional; flagged the Hobby-plan-is-non-commercial-use caveat to the user
- [ ] About page needs the founder's real name + photo (currently a generic placeholder
  with a TODO comment — did not fabricate a persona)
- [ ] Privacy/Terms are real, substantive, non-lorem policies but are not lawyer-reviewed

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
See `app/.env.example` for the authoritative list, and `app/README.md` for setup and
Vercel deploy steps.

## Known issues
- Dev mode (Turbopack) shows a multi-second delay compiling a route's client chunk on
  first visit — a page/step can sit at near-zero opacity briefly before its transition
  plays. Confirmed dev-only compilation lag, not a production issue (also confirmed via
  `pnpm build`).

## Deferred (parked deliberately — do not pull forward without a decision)
payments · print export · Slack/Teams · gifting · per-account custom domains · threaded comments · scheduled delivery · multi-admin · owner analytics · public API · Tier 2/3 SEO long-tail pages (relationship/milestone) · 3 seeded demo boards on the homepage
