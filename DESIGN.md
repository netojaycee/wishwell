# DESIGN.md — Fondly Held

The product is competing on feel. Kudoboard is functional and corporate. ForeverMissed is dated. The opening is: **make the most beautiful version of this that exists.**

## Direction

Editorial warmth, not SaaS blue. Think a well-made greeting card, not a dashboard.

- **Type:** one expressive serif for headlines (Fraunces, Instrument Serif, or Playfair) + one clean sans for body (Geist, Inter). The serif does most of the emotional work — do not ship an all-sans product.
- **Colour:** every theme is a 5-token palette (bg, surface, ink, accent, accentSoft). Never hardcode colour; read from the theme.
- **Depth:** soft layered shadows, subtle grain overlay, gentle gradient meshes. No flat grey cards.
- **Space:** generous. Crowding kills the "this was made with care" read.
- **Radius:** consistent, generous (16–24px on cards).

## Motion profiles

Occasion type drives motion. This is a product rule, not a style preference.

| Profile | Occasions | Entrance | Ambient | Interaction |
|---|---|---|---|---|
| `celebratory` | birthday, congrats, wedding, new baby, work anniversary | confetti burst, spring scale-in | floating balloons/particles | bouncy hover, emoji pop |
| `warm` | farewell, retirement, thank-you, get-well, welcome | soft fade-up, staggered | slow gradient drift | gentle lift |
| `solemn` | memorial, sympathy | slow fade, no scale | still, faint grain only | subtle opacity shift only |

Never confetti on `solemn`. Never a bouncing spring on a memorial. Check the profile before adding any effect.

## Signature moments (build these, they are what get screenshotted)

1. **Board reveal** — recipient opens the link, brief curtain animation, then posts cascade in staggered. Two seconds max.
2. **Post cascade** — masonry grid, each card rises and fades on scroll, slight rotation variance so it reads handmade.
3. **Live counter** — "24 people have shared a memory" animating up on load.
4. **Slideshow mode** — fullscreen, Ken Burns drift on photos, cross-fades. Plays at parties and funerals alike.
5. **Post success** — the contributor's own card flies into the grid. Makes the act feel completed.

## Rules

- Everything respects `prefers-reduced-motion` — swap to instant fades, never disable content.
- No animation over 400ms on an interaction; entrances may run to 800ms.
- Mobile first at 375px. Most contributors arrive from a WhatsApp link on a phone.
- Loading states are skeletons in the theme palette, never a grey spinner.
- Media is the star: cards are photo-led, text-led cards get a coloured surface and larger type so they never look empty.
