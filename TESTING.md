# Testing Fondly Held

Thanks for helping test this before we open it up more widely — this doc explains what
the product is, what to try, and how to tell us what you find.

## What is this?

**Fondly Held** is a place to make a group card for someone, for any occasion —
birthdays, weddings, farewells, new babies, retirements, get-well wishes, work
anniversaries, and memorials/tributes too.

One person creates a board and shares a link. Anyone who gets that link can add a
message, a photo, a video, or a GIF — **no account or signup needed to post.** The board
becomes a beautiful page the recipient (or their family, for a memorial) can keep and
revisit forever.

Think Kudoboard, but for every occasion including the hard ones, and built to actually
look good — the design itself is a big part of what we're testing, not just whether
buttons work.

## The link to test on

**Live URL:** https://fondlyheld.vercel.app

Please test on the real deployed site, not a local copy — we're specifically trying to
catch things that only show up in production: real links shared over WhatsApp/iMessage,
real mobile browsers, real network conditions.

## How to report something

For each issue, tell us:
1. **What you did** (which page, what you clicked/typed)
2. **What you expected** to happen
3. **What actually happened** instead
4. **Device + browser** (e.g. "iPhone 14, Safari" or "Windows laptop, Chrome")
5. A screenshot or screen recording if you can — genuinely the fastest way to explain most UI issues
6. The board link, if it's specific to a board you made

Anything is fair game to report: bugs, confusing moments, slow-feeling pages, things
that look "off," or things you just think could be better. **Suggestions are just as
welcome as bug reports** — if something works fine but you'd have designed it
differently, say so.

Send findings to: **netojaycee@gmail.com** (or however you're already talking to us).

## What to test

Go through these roughly in order — the flow is designed to be used in this sequence.

### 1. Creating a board (no account)
- Go to the homepage, click through to create a board
- Try at least two different occasions — pick one **celebratory** one (birthday, wedding,
  congratulations) and one **solemn** one (memorial) so you can compare the tone. The
  celebratory one should feel festive; the memorial one should feel calm and dignified —
  no confetti, no bouncy animation, ever, on a memorial board. Flag it immediately if you
  see that.
- On the occasion and theme steps, check the cards look clearly selectable/selected
- Try the theme picker — do the previews match what actually shows up on the board?
- On the final "your board is live" screen: try both the **Copy** and (on a phone) the
  **Share** button — on mobile, Share should open your phone's normal share sheet
  (WhatsApp, Messages, etc.) with a message already filled in, not just a bare link
- There's a "keep this board safe" prompt suggesting you create an account — you don't
  have to right now, just note whether it reads as helpful or pushy

### 2. Viewing and sharing a board
- Open the board link you just got, on both desktop and your phone
- **Share the board link in WhatsApp or iMessage to yourself** and check the link
  preview (image, title, description) looks right and specific to your board — before you
  even tap it, it should be clear whose board it is and what occasion it's for
- Try the "View as slideshow" link at the bottom of a board with posts on it

### 3. Posting to a board (no account)
- Open the "Add your message" / "Share a memory" page from a board
- Write a message and watch the live preview on the side update as you type
- Try attaching a photo, then a video, then (if there's a GIF option) a GIF
- Submit it, and confirm it shows up on the actual board afterward
- Try posting several times in a row to the same board quickly — after 5 in an hour you
  should get a friendly rate-limit message, not an error page or a silent failure
- Try submitting with an empty message, or a very long one — you should get a clear,
  human error, never a raw crash

### 4. Owner account (sign up / sign in)
- Create an account (email + password)
- Try **Google sign-in** too if you have a Google account handy
- On your phone, check the sign-in/sign-up page still shows the logo and a way back to
  the homepage — it shouldn't feel like a bare, unbranded page
- Sign out and sign back in
- If you created a board as a guest earlier in this session (step 1), check that it
  automatically shows up in "My boards" after you sign up — you shouldn't have to do
  anything else to claim it

### 5. Managing a board (as the owner)
- From "My boards," open one you own
- Hide a post, then unhide it — confirm it disappears/reappears on the live board
- Pin a post
- Delete a post (this is permanent, use a test post)
- Edit the board's title, headline, and visibility (public/unlisted/private)
- Try "Invite by email" and "Copy share link"

### 6. Mobile, specifically
This product is meant to be used mobile-first (most contributors arrive from a WhatsApp
link on a phone), so please spend real time on an actual phone, not just a resized
browser window:
- The whole flow in sections 1–3 above, start to finish, on your phone
- Check nothing overlaps, gets cut off, or requires horizontal scrolling
- Check text is readable and buttons are easy to tap without zooming in
- Check every page you land on feels like it's part of the same product (logo/branding
  visible somewhere) — not just the homepage

### 7. The quieter pages
- About and Contact (linked from the homepage footer)
- Privacy and Terms — just check they load and read sensibly, not a deep review

### 8. General impressions
- Does anything feel slow?
- Does anything feel confusing — like you weren't sure what to do next?
- Does the tone ever feel wrong for the occasion (too playful on a serious board, too
  plain on a celebratory one)?
- Anything you'd want that isn't there? (Note: payments/pricing isn't built yet on
  purpose — everything is free right now, that's expected, no need to report it.)

## Known limitations (don't need to report these)
- No custom domain yet — the link is a `*.vercel.app` address
- Privacy Policy and Terms pages exist but haven't had a legal review yet
- The About page's founder bio is still a placeholder

Everything else is fair game. Thank you for testing!
