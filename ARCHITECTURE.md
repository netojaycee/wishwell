# ARCHITECTURE.md — Wishwell

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16, App Router, TypeScript | One deployable, RSC for fast public board pages, built-in image optimization, best-in-class SEO control |
| Styling | Tailwind v4 + shadcn/ui | Fastest path to a polished, consistent UI in one day |
| Motion | Motion (framer-motion) | The differentiator layer; layout animations and scroll reveals out of the box |
| DB | Neon Postgres | Serverless, branchable, free tier, zero ops |
| ORM | Drizzle | Type-safe, migrations in-repo, no runtime weight |
| Auth | Better Auth | Email + Google, owns its own tables in Postgres, no vendor lock |
| Media | Cloudflare R2 + presigned uploads | No egress fees; boards are media-heavy and long-lived |
| Email | Resend + React Email | Invites, board-ready notifications, magic links |
| Hosting | Vercel | Edge CDN, ISR, preview deploys. VPS is the fallback, not day one. |
| Analytics | Vercel Analytics + PostHog | Funnel: land → create → invite → post |
| Payments | Paystack (NGN) + Stripe (intl) | **Deferred past Day 1.** Ship free, add billing once boards exist. |

## Core model

Everything is a **Board**. Occasion is configuration.

```
User            id, email, name, image, createdAt
Board           id, ownerId, slug (unique), occasionTypeId, mode,
                recipientName, title, headline, coverImageUrl,
                themeId, visibility, status, deliverAt, closedAt, viewCount
OccasionType    id, key, label, category, motionProfile,
                defaultThemeId, promptText, ctaText, seoTitle, seoDescription
Theme           id, name, palette(json), backgroundUrl, fontPair,
                particleEffect, occasionTypeId?
Post            id, boardId, authorName, authorEmail?, body,
                mediaUrl?, mediaType, gifUrl?, status, pinned, createdAt
Reaction        id, postId, emoji, fingerprint
Invite          id, boardId, email, token, sentAt, openedAt
Report          id, postId, reason, createdAt
```

**Enums**
- `mode`: `collaborative` (time-boxed, has a delivery moment) | `tribute` (open-ended, no close date)
- `visibility`: `public` (indexable) | `unlisted` (link only, noindex) | `private` (owner + invitees)
- `status` (board): `draft` | `collecting` | `delivered` | `archived`
- `status` (post): `published` | `hidden` | `pending`
- `motionProfile`: `celebratory` | `warm` | `solemn`

Rule: no occasion-specific columns, ever. If an occasion needs a field, it goes in a `meta` JSONB column on Board.

## Routes

**Public**
```
/                             marketing home
/occasions/[key]              programmatic SEO landing page per occasion  ← traffic engine
/create                       board creation wizard
/b/[slug]                     the board (public, ISR, OG image)
/b/[slug]/post                add a post (no auth)
/b/[slug]/slideshow           fullscreen presentation mode
/pricing /about /privacy /terms
```

**Owner (auth)**
```
/dashboard                    my boards
/dashboard/b/[slug]           edit theme, moderate posts, invite, share
/dashboard/settings
```

**API / actions**
```
POST /api/boards              create
POST /api/boards/:id/posts    anonymous post (rate limited by IP + fingerprint)
POST /api/upload/sign         presigned R2 URL, MIME + size validated
POST /api/invites             send batch invites
```

Prefer Server Actions for owner mutations; keep route handlers for anonymous/public writes so rate limiting is explicit.

## Rendering & caching

- `/b/[slug]` — ISR, `revalidate: 60`, tag-revalidated on new post. Boards get shared into group chats; first paint must be instant.
- `/occasions/[key]` — statically generated at build from the OccasionType table. These are the SEO pages.
- Dynamic OG images via `next/og` per board: recipient name + theme + post count. This is what renders in WhatsApp and Slack previews and it materially drives click-through. Do not skip it.

## Security

- Zod validation on every input boundary.
- `sanitize-html` on post bodies; store plain text + limited formatting only.
- Upload: server-side MIME sniff, 25MB image / 100MB video cap, reject on mismatch.
- Rate limit anonymous posts: 5 per IP per board per hour, 20 per IP per day globally.
- Honeypot field + timing check on the post form instead of a captcha (keep friction at zero).
- Slugs are random-suffixed (`joyce-40th-x7k2`) so boards are not enumerable.

## Deploy

Vercel + Neon + R2. Env vars in `.env.example`. Preview deploy per PR. Custom domain on Cloudflare DNS.

Migration path to VPS later: the app is a standard Next.js standalone build — Dockerize, run behind Nginx, swap R2 for the same R2. Nothing here locks you to Vercel.
