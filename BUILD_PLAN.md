# BUILD_PLAN.md — Ship in one day

Goal by end of day: **a stranger can open a link, post a photo and a message to a beautiful animated board, and the owner can moderate it.** Nothing else matters today.

## Hour 0–1 — Foundation
- `create-next-app` (TS, App Router, Tailwind v4), shadcn init, Motion installed
- Neon project + Drizzle schema from `ARCHITECTURE.md`, first migration pushed
- Better Auth wired (email + Google), `/dashboard` gated
- Deploy to Vercel immediately with a placeholder page. **Deploy on hour one, not hour ten.**

## Hour 1–2 — Seed the occasion system
- Seed 10 OccasionTypes: birthday, farewell, memorial, wedding, new-baby, retirement, get-well, thank-you, congratulations, work-anniversary
- Seed 3 themes per occasion (palette, font pair, particle effect, motion profile)
- Memorial + get-well = `solemn` / `warm`. Never `celebratory`.

## Hour 2–4 — The board page `/b/[slug]` (the product)
- Animated hero: cover image, recipient name, occasion badge, post count, live-feeling counter
- Masonry post grid, staggered scroll reveal, hover lift
- Post detail lightbox with keyboard nav
- Particle/confetti layer driven by `motionProfile`, gated on `prefers-reduced-motion`
- Empty state that is genuinely lovely — most visitors see the board when it has 2 posts

## Hour 4–5 — Contribution flow (no auth)
- `/b/[slug]/post`: name, message, optional photo/video, GIF picker (Giphy API)
- Presigned R2 upload with progress
- Honeypot + rate limit
- Success state with confetti (if celebratory) and a "share this board" nudge → this is the loop

## Hour 5–6 — Creation wizard `/create`
- Step 1 occasion → Step 2 recipient name + headline → Step 3 theme picker with live preview → Step 4 done, copy share link
- Guest creation allowed; claim the board by signing in after. Removes all friction from the top of funnel.

## Hour 6–7 — Owner dashboard
- My boards list
- Board admin: edit theme/title, hide/delete/pin posts, copy link, invite by email (Resend)
- Slideshow mode `/b/[slug]/slideshow` — fullscreen autoplay, big win for events, low effort

## Hour 7–8 — SEO + trust shell
- `/occasions/[key]` generated for all 10 occasions from the DB (see `GROWTH.md` for the template)
- Marketing home, pricing (free tier + "Pro coming soon"), about, privacy, terms
- Dynamic OG images, sitemap.xml, robots.txt, JSON-LD
- Real footer, real contact email, favicon set. Trust signals are cheap and decisive.

## Hour 8–9 — Harden and ship
- Seed 3 gorgeous demo boards with real-looking content, link them from the home page as examples
- Mobile pass on every screen at 375px
- Lighthouse: target 90+ on the board page
- Point the domain, verify Resend DNS, smoke test the full anonymous flow on a phone on mobile data

## Deferred — do not build today
Payments · print/keepsake export · Slack/Teams · gifting · custom domains per account · comments/threads · scheduled delivery emails · multi-admin · analytics dashboard · API

## The one real order
The person who asked for this gets their board built by you personally today, on the live product. Use their board as demo content and as the first case study — with their permission.
