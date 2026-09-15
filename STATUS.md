# STATUS.md — Wishwell

> Living file. The agent updates this after every meaningful change. Keep it short and true. Delete finished noise; this is a state file, not a changelog.

**Last updated:** 2026-09-15
**Phase:** Day-1 build — functionally complete end to end, not yet deployed
**Live URL:** _(pending — not yet deployed to Vercel)_
**Repo:** local git only, no GitHub remote yet. Flattened: the Next.js app used to live
in an `app/` subdirectory; it's now at the repo root (no Root Directory override needed
on Vercel).

## Now
- [ ] Push to GitHub + import into Vercel (needs the user's accounts — see Blocked)
- [ ] Confirm the R2 credentials in `.env.local` are meant for Wishwell — the bucket
  (`lagosphoto-dev-assets`) and public URL (`cdn-lp.johnedeh.com`) read like they may be
  reused from a different project rather than created for this one. Not blocking (media
  upload works either way) but worth a conscious check before real users upload to it.
- [ ] Seed 3 real demo boards with real content, once the app is live somewhere shareable
- [ ] Lighthouse pass on the board page once deployed (can't meaningfully test prod
  performance against local dev/Turbopack)

## Done
Everything in `BUILD_PLAN.md` Hours 0-8 except the items above. Concretely:
- Next.js 16 (App Router, Turbopack, Tailwind v4) at the repo root, shadcn/ui initialized
- Drizzle schema for Board/OccasionType/Theme/Post/Reaction/Invite/Report + Better Auth's
  own tables. `.env.local` now points at a real Neon Postgres project (database
  `wishwell`) — migrated and seeded. (Local DBngin Postgres still works fine as an
  alternative; just swap `DATABASE_URL` back to `postgresql://postgres@127.0.0.1:5432/wishwell_dev`.)
- Seeded 10 occasion types x 3 themes each with real editorial palettes (seeded into Neon)
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
- R2 (presigned upload) and Resend (invite email) keys are now in `.env.local` and
  should be live — not yet click-tested (no media/invite flow run against them in this
  session). Giphy still unset, GIF picker still no-ops cleanly.
- `pnpm lint`, `tsc --noEmit`, and `pnpm build` (production) all clean; checked mobile
  layout in-browser at a sub-`sm`-breakpoint width (couldn't force exactly 375px through
  the browser automation tool in this environment, but the same mobile-first CSS path
  applies at any width below 640px)

## Blocked / needs a human decision
- [x] Neon project + connection string — done, migrated and seeded
- [x] R2 bucket + keys — present in `.env.local`; see the "Now" item above re: whether
  the bucket is actually meant for this project
- [x] Resend API key — present; still needs a verified sending domain for real delivery
  to arbitrary recipients (sandbox mode only reaches the account owner's own address)
- [ ] Vercel account — need `vercel login` or a dashboard import to actually deploy
- [ ] GitHub repo to push to
- [ ] Google OAuth client (email/password auth works without it)
- [ ] Giphy API key (free, developers.giphy.com)
- [ ] No domain yet — shipping on the Vercel-provided `*.vercel.app` URL is fully
  functional; flagged the Hobby-plan-is-non-commercial-use caveat to the user
- [ ] About page needs the founder's real name + photo (currently a generic placeholder
  with a TODO comment — did not fabricate a persona)
- [ ] Privacy/Terms are real, substantive, non-lorem policies but are not lawyer-reviewed

## Environment
`.env.local` (gitignored, not in this file) currently has: a real Neon `DATABASE_URL`,
real R2 credentials, a real Resend API key, and empty `GOOGLE_CLIENT_ID`/`GIPHY_API_KEY`.
See `.env.example` for the full variable list (template, no secrets, tracked in git),
and `README.md` for setup and Vercel deploy steps.

## Known issues
- Dev mode (Turbopack) shows a multi-second delay compiling a route's client chunk on
  first visit — a page/step can sit at near-zero opacity briefly before its transition
  plays. Confirmed dev-only compilation lag, not a production issue (also confirmed via
  `pnpm build`).
- Gotcha (resolved, noting for future reference): a root-level `app/` directory, even
  if empty of page files, silently wins over `src/app/` for Next's App Router — every
  route 404'd except `/_not-found` until that stray directory was removed. If routes
  ever start vanishing again, `ls` the repo root for a stray `app/`.

## Deferred (parked deliberately — do not pull forward without a decision)
payments · print export · Slack/Teams · gifting · per-account custom domains · threaded comments · scheduled delivery · multi-admin · owner analytics · public API · Tier 2/3 SEO long-tail pages (relationship/milestone) · 3 seeded demo boards on the homepage
