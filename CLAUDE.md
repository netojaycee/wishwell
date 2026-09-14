# CLAUDE.md — Wishwell

You are the engineering agent on Wishwell. Read this file, then `ARCHITECTURE.md`, then `STATUS.md` before doing anything. Update `STATUS.md` after every meaningful change.

## What Wishwell is

A multi-tenant SaaS for **collaborative occasion boards**. One person creates a board for someone (birthday, farewell, memorial, wedding, new baby, retirement, get-well, thank-you). They share a link. Anyone with the link posts a message, photo, video or GIF — no signup required. The board is a beautiful, animated, permanent page the recipient can revisit.

Two reference products, deliberately merged:
- **Kudoboard** — short-lived collaborative boards with a "delivery" moment.
- **ForeverMissed** — long-lived tribute pages with open-ended posting.

Wishwell supports both as *modes* of the same object.

## Non-negotiable product rules

1. **One Board model, many occasion presentations.** Never branch code per occasion. Occasion type is data: theme, copy, prompts, motion profile. Adding an occasion must be a row, not a deploy.
2. **Contributing never requires an account.** Link → post → done. Only board *owners* have accounts. This is the entire growth loop; do not break it.
3. **Tone follows occasion.** Memorial boards must never fire confetti. Every occasion type carries a `motionProfile` (`celebratory` | `warm` | `solemn`) and the UI must respect it. Getting this wrong is the worst possible bug in this product.
4. **Beauty is the feature.** This ships against funded incumbents. If a screen is functional but plain, it is not done. See `DESIGN.md`.
5. **Every board is a public, indexable, share-worthy page** unless the owner marks it private. Boards are the SEO and virality surface.

## Working style

- Ship vertical slices that work end to end, not layers. A half-built board that a stranger can post to beats a perfect schema with no UI.
- Server Components by default. Client Components only where there is motion, upload, or interaction state.
- No premature abstraction. Two occasions sharing code is a coincidence; three is a pattern.
- Never invent scope. If it is not in `BUILD_PLAN.md` Day 1, it does not ship today. Write it into the Deferred section of `STATUS.md` instead.
- Every file you add that another agent must understand gets a one-line header comment saying why it exists.

## Guardrails

- Never commit secrets. All config via env vars; keep `.env.example` current.
- All user-submitted content is untrusted: sanitize HTML, validate MIME types and file size server-side, never trust the client.
- Rate-limit anonymous posting endpoints. Open posting with no limit is an abuse vector on day one.
- Moderation exists from v1: owner can hide or delete any post. Add a global report button.
- Media deletion must actually delete from object storage, not just the DB row.
- Memorial and sympathy boards handle grief. No growth-hacky copy, no upsell modals, no "🎉" anywhere in that flow.

## Definition of done for any task

- [ ] Works on a 375px viewport first, then desktop.
- [ ] Loading and empty states designed, not default spinners.
- [ ] Errors surface as human sentences, never raw exceptions.
- [ ] Motion respects `prefers-reduced-motion`.
- [ ] `STATUS.md` updated.
