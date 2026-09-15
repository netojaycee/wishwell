# STATUS.md — Fondly Held

> Living file. The agent updates this after every meaningful change. Keep it short and true. Delete finished noise; this is a state file, not a changelog.

**Last updated:** 2026-09-15
**Phase:** Day-1 build — functionally complete end to end, not yet deployed
**Live URL:** _(pending — not yet deployed to Vercel)_
**Repo:** pushed to `github.com/netojaycee/wishwell` on `main` — repo name is still the
old brand (renaming a GitHub repo is safe/non-breaking, GitHub redirects the old URL, but
it's a deliberate choice; not done automatically here).

## Now
- **Rebrand: Wishwell → Fondly Held.** wishwell.vercel.app was already taken; picked a
  name with a confirmed-available `fondlyheld.com` (WHOIS-checked) and no direct product
  conflicts found. All user-facing copy, page titles/metadata, JSON-LD, footer, legal
  pages, occasion SEO copy, and `package.json` updated. **Deliberately NOT renamed:**
  the Neon database (still named `wishwell`), the local DBngin database (`wishwell_dev`),
  the R2 bucket (`wishwell-assets`), and the GitHub repo (`netojaycee/wishwell`) — these
  are internal identifiers with real rename cost/risk and no user-facing benefit; only
  cosmetic to leave as-is.
- [ ] Decide the Vercel project name/slug (e.g. `fondly-held` or `fondlyheld`) when
  importing — check it's free before committing.
- [ ] Import into Vercel (pushed to GitHub already — see Repo above)
- [ ] Once deployed, update `BETTER_AUTH_URL` / `NEXT_PUBLIC_APP_URL` to the real
  `*.vercel.app` URL (or the real domain, if `fondlyheld.com` gets bought)
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
- R2, Resend, Google OAuth, and Giphy keys are all now in `.env.local` — not yet
  click-tested (no media upload, invite email, Google sign-in, or GIF picker flow run
  against them in this session).
- `pnpm lint`, `tsc --noEmit`, and `pnpm build` (production) all clean; checked mobile
  layout in-browser at a sub-`sm`-breakpoint width (couldn't force exactly 375px through
  the browser automation tool in this environment, but the same mobile-first CSS path
  applies at any width below 640px)

## Blocked / needs a human decision
- [x] Neon project + connection string — done, migrated and seeded
- [x] R2 bucket + keys — present in `.env.local`, confirmed meant for this project
  (`wishwell-assets` bucket, `cdn-ww.johnedeh.com`)
- [x] Resend API key — present; still needs a verified sending domain for real delivery
  to arbitrary recipients (sandbox mode only reaches the account owner's own address)
- [x] Google OAuth client — present in `.env.local`
- [x] GitHub repo — pushed, see Repo above
- [ ] Vercel account — need `vercel login` or a dashboard import to actually deploy
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
- Recurring gotcha: the user's editor has twice re-saved `.env.local` to the old
  `app/.env.local` path (from before the repo flatten) after it was deleted, recreating
  the stray `app/` directory above and breaking routing both times. If this happens
  again: merge `app/.env.local`'s content into the real `.env.local`, `rm -rf app`, and
  ask the user to close/reopen that file tab in their editor.

## Deferred (parked deliberately — do not pull forward without a decision)
payments · print export · Slack/Teams · gifting · per-account custom domains · threaded comments · scheduled delivery · multi-admin · owner analytics · public API · Tier 2/3 SEO long-tail pages (relationship/milestone) · 3 seeded demo boards on the homepage
