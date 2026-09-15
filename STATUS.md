# STATUS.md — Fondly Held

> Living file. The agent updates this after every meaningful change. Keep it short and true. Delete finished noise; this is a state file, not a changelog.

**Last updated:** 2026-09-15
**Phase:** Day-1 build — live in production, polished, tester guide ready to send
**Live URL:** https://fondlyheld.vercel.app — confirmed deployed and auto-deploying from
`main` on every push (Vercel's git integration). Email/password sign-up verified working
directly against production (not just locally). Production and local dev currently share
the same Neon database, so boards created in either place show up in both.
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
- [ ] **Media upload (photo/video) is broken in both local and production** — traced via
  a real browser test (uploaded a real file, read the actual network request), not
  guessed. Two separate causes, both need the user's action in dashboards this agent
  can't reach:
  1. **R2 bucket CORS policy rejects the browser's upload preflight with 403**, in local
     dev at minimum (same bucket is used in prod, so almost certainly there too once #2
     is fixed). In the Cloudflare dashboard → R2 → the `wishwell-assets` bucket →
     Settings → CORS Policy, add a rule allowing `PUT` (and `GET`) from
     `http://localhost:3005` and `https://fondlyheld.vercel.app` (and any future custom
     domain). Example policy:
     ```json
     [
       {
         "AllowedOrigins": ["http://localhost:3005", "https://fondlyheld.vercel.app"],
         "AllowedMethods": ["PUT", "GET"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3600
       }
     ]
     ```
  2. **Production is missing R2 env vars entirely** — the "Add a photo or video" button
     doesn't even render there (only "Add a GIF" shows), meaning `hasR2` evaluates false,
     meaning one or more of `R2_ACCOUNT_ID`/`R2_ACCESS_KEY_ID`/`R2_SECRET_ACCESS_KEY`/
     `R2_BUCKET`/`R2_PUBLIC_URL` isn't set in the Vercel project's environment variables.
     Copy the current values from local `.env.local` into Vercel → Project → Settings →
     Environment Variables, then redeploy.
  Code-side, the silent-failure bug (an upload that failed still got treated as if it
  succeeded, hence "blank" previews) is already fixed and pushed — uploads now correctly
  show an error instead of pretending to work. GIFs were never affected (they're Giphy
  URLs, no R2 involved) — that's why only GIF worked in the preview.
- [x] `TESTING.md` (repo root) — live URL filled in (https://fondlyheld.vercel.app), ready
  to send to testers **once the R2 issue above is fixed** — don't send it out with media
  upload broken.
- [ ] Add authorized redirect URIs in Google Cloud Console — needs **both**
  `http://localhost:3005/api/auth/callback/google` (local dev) **and**
  `https://fondlyheld.vercel.app/api/auth/callback/google` (production). Email/password
  auth confirmed working in production already; Google sign-in not yet re-tested since
  the redirect URI fix.
- [ ] Seed 3 real demo boards with real content — production is live now, so this can
  happen directly there
- [ ] Lighthouse pass on the board page against the real production URL
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

**Second polish pass** — Fixed a real bug: `b/[slug]`'s `generateMetadata` set
`openGraph.images` to an explicit `undefined` for any board without a `coverImageUrl`
(nearly all of them), which suppresses Next's auto-detected `opengraph-image.tsx` for
that route — very likely why board links weren't showing previews in WhatsApp. Added a
site-wide default `opengraph-image.tsx` + `openGraph`/`twitter`/`metadataBase` to the
root layout (previously only board pages had any OG image at all). `components/brand/
split-shell.tsx` generalizes the auth split-screen layout, now also used by About/Contact
(moved out of the `(marketing)` group) and given a mobile-only header — auth/about/contact
pages had **zero branding and no way home on a phone** before this. The "board is live"
step in `/create` now has copy-to-clipboard (with feedback) and a Web Share API button
with occasion-personalized share text, plus a calm (non-growth-hacky, memorial-safe)
"keep this board safe" card nudging guest creators toward an account instead of one line
of small text. `/create`'s occasion and theme cards now have permanent visible borders
(previously only visible on hover/selection).

**Pictorial/motion pass (2026-09-15)** — the site read as too plain/text-only; it now
carries real photos, GIFs, illustrations and profile-aware animation on every surface.
Shared layer (reuse these, don't reinvent):
- `src/lib/content/moments.ts` — registry of 19 curated photos (Unsplash licence,
  self-hosted as WebP in `public/images/moments/`, ~1.4MB total), 5 illustrated GIFs
  (hotlinked from GIPHY, credited in the footer), and per-occasion demo showcases.
  **Illustrative demo content only — never present it as testimonials/real users.**
  `showcaseFor(key, profile)` falls back by motion profile for unknown occasion keys.
- `src/components/illustrations/occasion-art.tsx` — one hand-drawn SVG per occasion,
  coloured from the theme palette; celebratory bobs/twinkles, warm drifts, solemn
  (memorial) never animates. Unknown keys → generic envelope (no deploy per occasion).
- `src/components/showcase/demo-card.tsx` / `demo-board.tsx` — static themed post card /
  mini board used for marketing.
- `fh-*` keyframes/classes in `globals.css`; all stop under `prefers-reduced-motion`.
Applied to: home (photo hero collage incl. mobile, photo occasion tiles, "every tone"
three-board section, animated how-it-works, GIF/photo marquee, trust band, closing CTA),
occasion pages (themed hero + demo board, note-card tips), board page (occasion art,
illustrated empty state with ghost cards, rising balloons / falling confetti ambient on
celebratory boards only, keyed off `theme.particleEffect`), post form + success state
(solemn success is still, calm copy, no "create your own" nudge), create wizard
(illustrated occasion cards, live preview, mini-board theme previews), dashboard,
split-shell panel (photo cards), 404, footer credits. Also fixed along the way:
occasion-page H1/title showed "… | Fondly Held" (and doubled the brand in the tab
title); site header wrapped onto two lines at 375px; split-shell mobile header row
ballooned to half the screen; board-page `-z-10` ambient layers now sit inside an
`isolate` wrapper so warm drift / solemn grain actually render.

**Checks** — `pnpm lint`, `tsc --noEmit`, `pnpm build` (production) all clean. True
375px checks are possible here by loading pages inside a 375px-wide same-origin iframe
(the automation window can't shrink below ~756px) — home, occasion, create, post,
board pages verified with no horizontal overflow. Note: the automation Chrome window is
unfocused, so rAF-driven entrance fades crawl in screenshots — not a real-world bug.

## Blocked / needs a human decision
- [x] Vercel — deployed, live at https://fondlyheld.vercel.app, auto-deploys from `main`
- [ ] Giphy API key is present but untested; GIF picker not click-tested this session
- [ ] No custom domain yet — shipping on `fondlyheld.vercel.app` is fully functional.
  Flagged to the user: Vercel's Hobby plan is licensed for non-commercial use
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
