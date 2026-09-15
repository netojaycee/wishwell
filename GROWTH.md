# GROWTH.md — Fondly Held: being seen and being trusted

The code is the easy half. This is the half that decides whether it exists.

---

## 1. The growth loop (design everything around this)

```
Owner creates a board
      ↓
Shares one link to 10–40 people (WhatsApp, Slack, email)
      ↓
Each contributor lands on a beautiful branded page
      ↓
Posts without an account → sees "create your own board" at the success moment
      ↓
Some fraction become owners
```

Every product decision is judged against this loop. Signup walls for contributors would kill it. The OG image, the success-state CTA, and the footer "Made with Fondly Held" on every public board are the three highest-leverage growth surfaces in the entire product — treat them as core features, not decoration.

Board slugs must be shareable and pretty. The link *is* the ad.

---

## 2. SEO: the programmatic occasion engine

This is exactly how Kudoboard gets its traffic, and it is fully copyable.

**One page template × every occasion × every relationship × every milestone.**

Tier 1 — occasions (build all 10 today):
```
/occasions/birthday-cards-online
/occasions/farewell-cards
/occasions/memorial-pages
/occasions/retirement-cards
/occasions/get-well-soon-cards
/occasions/thank-you-cards
/occasions/new-baby-cards
/occasions/wedding-cards
/occasions/congratulations-cards
/occasions/work-anniversary-cards
```

Tier 2 — relationship long-tail (generate week 2, ~60 pages):
`birthday-cards-for-mom`, `for-dad`, `for-boss`, `for-coworkers`, `for-best-friend`, `for-husband`, `for-wife`, `for-teacher`…

Tier 3 — milestone long-tail (~20 pages):
`21st-birthday-cards`, `30th`, `40th`, `50th`, `60th`, `70th`…

Each page needs: unique H1, 300+ words of genuinely useful copy, three live example boards, an FAQ block with `FAQPage` JSON-LD, and a create CTA prefilled with that occasion. **Do not ship 100 thin duplicated pages** — that is a Google penalty, not a strategy. Ten strong pages beat a hundred empty ones.

**Technical SEO checklist (today):**
- [ ] `sitemap.xml` including all public boards and occasion pages
- [ ] `robots.txt`, with `noindex` on unlisted/private boards
- [ ] Unique title + meta description per occasion page
- [ ] `Organization`, `WebSite`, `FAQPage`, `BreadcrumbList` JSON-LD
- [ ] Canonical tags
- [ ] Dynamic OG + Twitter cards on every board
- [ ] Google Search Console + Bing Webmaster verified, sitemap submitted
- [ ] Core Web Vitals: LCP under 2s on the board page

**Content engine (weeks 2+):** the highest-volume, lowest-competition wins in this niche are message-idea listicles — "what to write in a farewell card", "100 birthday wishes for a friend", "memorial message examples". They rank, and every one converts directly into a board. Kudoboard's blog is almost entirely this.

---

## 3. Trust — the thing that decides whether people put a funeral on your site

Digital trust is unusually load-bearing here. People are uploading photos of dead relatives and children.

**Ship today:**
- Real privacy policy and terms (not lorem)
- A named human on the About page — you, with a photo and a real email
- HTTPS, custom domain, professional favicon and logo
- Working contact route that a human answers
- "Your board is yours forever" and "we never sell your data" stated plainly on the home page
- Clear data-deletion promise and a working delete button

**Week 1:**
- 3–5 real testimonials with names and photos from your first boards
- A visible example gallery of real (permissioned) boards
- Uptime and "X boards created" counter once the number isn't embarrassing
- Founder story post — Nigerian-built, personal origin. It converts.

**Never:** dark patterns, fake countdown timers, fake user counts, upsells inside a memorial flow. One screenshot of that circulating ends the brand.

---

## 4. Launch sequence

**Day 1 (today):** ship, build the client's real board on it, get it in front of five people on their phones.

**Days 2–7 — seeded, not broadcast:**
- Personally build 10 boards for real occasions in your network. Free. Each one exposes the product to 20–40 contributors. This is the single most effective growth action available and it costs you nothing but hours.
- Post the build story on X/LinkedIn — "I built a Kudoboard alternative in a day" performs well in dev circles and gets you your first backlinks.
- Nigerian/African tech communities: TechCabal, Zikoko, dev Twitter, relevant WhatsApp and Slack groups.

**Week 2 — directories (backlinks + traffic):**
Product Hunt (Tuesday–Thursday launch), BetaList, Indie Hackers, Hacker News Show HN, AlternativeTo (list yourself under Kudoboard — high intent), SaaSHub, Uneed, Fazier, There's An AI For That if you add any AI features.

**Week 3+ — durable channels:**
- Pinterest — massively underused for occasion/greeting content, and the board visuals are natively pinnable
- TikTok/Reels — "surprise reaction" videos of someone opening their board. This format is proven and emotional.
- Wedding planners, funeral homes, HR/office managers, church groups — partnership channels with repeat volume
- Reddit: r/HumanResources, r/weddingplanning, r/Teachers — answer questions, don't spam

---

## 5. Positioning against the incumbents

| | Kudoboard | ForeverMissed | **Fondly Held** |
|---|---|---|---|
| Occasions | corporate-first | memorial only | every occasion, one product |
| Pricing | from $5.99/board | subscription | generous free tier |
| Design | functional | dated | the reason people choose it |
| Feel | HR tool | somber | made with care |

**One-liner:** *Fondly Held — beautiful group cards and tribute pages for every occasion. One link, everyone contributes, they keep it forever.*

Lead with **beauty** and **free**. Those are the two things the incumbents cannot quickly match.

---

## 6. What to measure from day one

Land → start create → publish board → invites sent → first contributor post → 5+ posts → contributor becomes owner.

Boards created, posts per board (the health metric — a board with 1 post failed), contributor→owner conversion, share-link click-through. Instrument the funnel today; you cannot reconstruct week one later.
