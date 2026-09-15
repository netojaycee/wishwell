# STATUS.md — Fondly Held

> Living file. The agent updates this after every meaningful change. Keep it short and true. Delete finished noise; this is a state file, not a changelog.

**Last updated:** 2026-09-15
**Phase:** Day-1 build — functionally complete end to end, polished, not yet deployed
**Live URL:** _(pending — not yet deployed to Vercel)_
**Repo:** `github.com/netojaycee/wishwell` on `main`, fully pushed and up to date. Repo/
Neon DB/R2 bucket names still say "wishwell" (the product was renamed mid-build — see
Done) — left alone deliberately, internal identifiers only, no user-facing effect.

## Orientation for a new agent (read this first)
1. Read `CLAUDE.md` (product rules — **including free-for-all pricing policy**, now
   codified there), then `ARCHITECTURE.md`, then this file, in that order.
2. The whole app lives at the repo root (`src/`, `package.json`, etc. — not in a
   subdirectory). `pnpm install && pnpm dev` — dev server is pinned to port **3005**
   (see Known Issues for why).
3. `.env.local` already has real, working credentials for Neon/R2/Resend/Google/Giphy —
   ask the user before assuming you need new ones.
4. Check "Known issues" below before debugging anything that looks like routing or auth
   breaking mysteriously — there are two recurring environmental gotchas specific to this
   machine, already diagnosed, documented there.

## Now (actually pending)
- [ ] Deploy to Vercel — code is ready and pushed; needs the user's Vercel account
  (dashboard import, no CLI access from this agent). See Blocked.
- [ ] Add `http://localhost:3005/api/auth/callback/google` as an authorized redirect URI
  in Google Cloud Console (email/password auth works now; Google sign-in doesn't until
  this is added — confirmed via Google's own error page, not guessed)
- [ ] Seed 3 real demo boards with real content, once the app is live somewhere shareable
- [ ] Lighthouse pass on the board page once deployed
- [ ] About page needs the founder's real name + photo (placeholder + TODO comment there
  now — did not fabricate a persona)
- [ ] Privacy/Terms are real, substantive, non-lorem policies but not lawyer-reviewed

## Done
Everything in `BUILD_PLAN.md` Hours 0–9 except the items above, plus a full visual
polish pass. Concretely, by area:

**Core product** — Next.js 16 (App Router, Turbopack, Tailwind v4) at the repo root.
Drizzle schema (Board/OccasionType/Theme/Post/Reaction/Invite/Report + Better Auth's own
tables) against Neon Postgres, migrated and seeded (10 occasion types × 3 themes each,
real editorial copy). `/create` wizard (guest, no account) → themed `/b/[slug]` board
page → `/b/[slug]/post` anonymous contribution flow, all verified end-to-end in-browser,
including that memorial (solemn) boards never fire confetti while celebratory ones do.
`/b/[slug]/slideshow` fullscreen presentation mode.

**Owner side** — Email/password + Google auth, `/dashboard` board list,
`/dashboard/b/[slug]` moderation (hide/unhide/pin/delete, edit title/headline/
visibility, invite by email, copy share link). Guest-created boards auto-claim to the
owner's account on first dashboard visit after signing up.

**SEO/marketing** — Home page, all 10 `/occasions/[key]` pages (statically generated,
~300+ words real copy, FAQ + JSON-LD, live recent-boards), sitemap.xml, robots.txt,
Organization/WebSite JSON-LD, dynamic per-board OG image, About/Privacy/Terms/Contact.

**Design/brand** — Rebranded Wishwell → Fondly Held (wishwell.vercel.app was taken;
`fondlyheld.com` confirmed available via WHOIS, no product conflicts — ~55 invented names
tried and rejected first, the short-brandable-.com space is thoroughly squatted). Custom
logomark (open heart + held dot, not a generic filled heart — reads warm without being
romantic/cutesy, still appropriate on memorial boards), used as favicon/apple-icon/
header/footer. Warm terracotta brand accent used consistently. Desktop-scale visual pass:
gradient-mesh hero + card collage on the home page, site-wide grain texture, branded
404 page. Split-screen sign-in/sign-up pages (were plain centered forms, looked bare next
to the rest of the redesigned site). Post-contribution form redesigned with a **live
preview card** that mirrors the actual board styling as the contributor types — the
message textarea uses the board's own heading font so it feels like writing on the card,
not filling out a generic form.

**Safety/infra** — Postgres-backed rate limiting (no Redis dependency), honeypot +
timing bot check, HTML sanitization on all anonymous input, hashed (not raw) IPs. R2
presigned uploads and Resend invite email both confirmed working with real credentials
(a real photo upload via R2 is live on a test board). Giphy and Google OAuth keys present;
Giphy not yet click-tested, Google blocked on the redirect URI step above.

**Checks** — `pnpm lint`, `tsc --noEmit`, `pnpm build` (production) all clean as of the
last commit. Mobile layout checked in-browser at a sub-`sm`-breakpoint width (couldn't
force exactly 375px through the browser automation tool in this environment, but the
same mobile-first CSS path applies at any width below the 640px `sm` breakpoint).

## Blocked / needs a human decision
- [ ] Vercel account — need `vercel login` or a dashboard import to actually deploy
- [ ] Giphy API key is present but untested; GIF picker not click-tested this session
- [ ] No domain yet — shipping on the Vercel-provided `*.vercel.app` URL is fully
  functional. Flagged to the user: Vercel's Hobby plan is licensed for non-commercial use
- [ ] Decide the Vercel project name/slug at import time (e.g. `fondly-held`) — check
  it's free before committing
- [ ] About page name/photo and Privacy/Terms legal review — see Now

## Environment
`.env.local` (gitignored, not reproduced here) has real working values for
`DATABASE_URL` (Neon), `BETTER_AUTH_SECRET`/`URL`, `NEXT_PUBLIC_APP_URL`,
`GOOGLE_CLIENT_ID`/`SECRET`, all `R2_*` vars, `RESEND_API_KEY`, and `GIPHY_API_KEY`.
`BETTER_AUTH_URL` and `NEXT_PUBLIC_APP_URL` are pinned to `http://localhost:3005` — keep
them matching the dev port (see Known Issues). See `.env.example` for the full variable
list (template, no secrets, tracked in git) and `README.md` for setup + Vercel deploy
steps.

## Known issues
- **Dev server is pinned to port 3005** (`package.json` → `"dev": "next dev -p 3005"`).
  Do not remove this. Ports 3000 and 3001 are permanently occupied by another project on
  this machine; without a pinned port, `next dev` silently drifts to whatever port is
  free, `BETTER_AUTH_URL`/`NEXT_PUBLIC_APP_URL` fall out of sync with it, and Better Auth
  rejects the origin mismatch — this broke both email/password and Google auth for a
  while before it was diagnosed. If auth ever "just stops working" again, check the dev
  server's actual port against `.env.local` first.
- **A root-level `app/` directory silently wins over `src/app/`** for Next's App Router,
  even if it's empty of page files — every route 404'd except `/_not-found` until this
  was diagnosed once already. If routes vanish, `ls` the repo root for a stray `app/`
  before anything else.
- The above has recurred because the user's editor keeps a stale buffer for the old
  `app/.env.local` path (from before the repo was flattened) and re-saves it there,
  recreating the directory. If it happens again: merge that file's content into the real
  `.env.local`, `rm -rf app`, and ask the user to close/reopen the file tab in their
  editor so it points at the real path.
- Turbopack dev mode has a multi-second first-compile delay per route — a page/step can
  sit at near-zero opacity briefly before its entrance transition plays. Confirmed
  dev-only (not present in `pnpm build`), not a real bug.

## Deferred (parked deliberately — do not pull forward without a decision)
payments (**product is 100% free right now — see CLAUDE.md rule 6, do not build pricing
gates**) · print export · Slack/Teams · gifting · per-account custom domains · threaded
comments · scheduled delivery · multi-admin · owner analytics · public API · Tier 2/3 SEO
long-tail pages (relationship/milestone) · 3 seeded demo boards on the homepage
