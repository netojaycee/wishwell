// Editorial copy for each /occasions/[key] landing page — real, specific writing rather
// than templated filler (GROWTH.md: "300+ words of genuinely useful copy... do not ship
// thin duplicated pages"). Keyed by OccasionType.key.
export type OccasionCopy = {
  intro: string[];
  tips: string[];
  faqs: { q: string; a: string }[];
};

export const occasionCopy: Record<string, OccasionCopy> = {
  birthday: {
    intro: [
      "A birthday card that everyone signs in the hallway before handing it over is a nice tradition, but it only reaches the people in the building that day. A Wishwell birthday board does the same thing for everyone who couldn't be there — the coworker who moved teams, the college roommate three time zones away, the grandparent who isn't on the group chat.",
      "You create the board, pick a theme, and share one link. Anyone who gets it can add a message, a photo, or a short video in under a minute — no account, no app to download. The board fills up over the days before the birthday, and you can reveal it all at once or let people watch it grow.",
    ],
    tips: [
      "Mention a specific memory, not just \"happy birthday\" — it's what people reread later.",
      "If you know their year ahead (a new job, a move, a milestone), acknowledge it.",
      "A short video with your voice lands differently than text — even 10 seconds.",
      "Pin the recipient's closest people's messages near the top so they're seen first.",
    ],
    faqs: [
      { q: "Do people need an account to sign the board?", a: "No. Anyone with the link can add a message, photo, or video — no signup, no app." },
      { q: "Can I control when the board is revealed?", a: "Yes. Keep collecting for as long as you like, then share the link with the recipient whenever you're ready." },
      { q: "Is it really free?", a: "Yes — creating a board and collecting messages is free. There's no limit on the number of contributors." },
      { q: "What if someone posts something inappropriate?", a: "As the board owner you can hide or delete any post at any time, and anyone can report a post for review." },
    ],
  },
  congratulations: {
    intro: [
      "Graduations, promotions, new homes, passed exams — the moments worth celebrating don't always come with a built-in way to gather everyone's reaction. A congratulations board gives a scattered group of well-wishers one place to land, instead of a dozen separate texts the recipient has to piece together.",
      "Start a board, share the link in the group chat or over email, and let messages accumulate. Because it's one page instead of one notification per person, the recipient gets to sit with all of it at once — which tends to land harder than any single message would on its own.",
    ],
    tips: [
      "Name the specific achievement — \"congrats\" alone reads generic next to twenty others.",
      "If you watched the effort happen, say what you saw, not just the outcome.",
      "Photos from along the way (not just the finish line) add texture the recipient won't have seen.",
      "Keep it short — a genuine two sentences beats a long message that repeats itself.",
    ],
    faqs: [
      { q: "How many people can contribute to one board?", a: "There's no cap — boards work equally well for a five-person team or a hundred-person extended family." },
      { q: "Can I add photos and videos, not just text?", a: "Yes, contributors can attach a photo, a short video, or a GIF alongside their message." },
      { q: "Can I make the board private?", a: "Yes — boards can be public, unlisted (link-only), or private to invited people only." },
      { q: "Does the recipient need to do anything to view it?", a: "No — they just open the link. No account required to view or to contribute." },
    ],
  },
  wedding: {
    intro: [
      "A physical guestbook only reaches the people standing in the room, and it usually goes straight into a drawer afterward. A Wishwell wedding board captures well-wishes from everyone — guests at the venue, family who couldn't travel, friends watching from afar — and it stays somewhere the couple will actually revisit.",
      "Set the board up before the big day and share the link in the invitation or the group chat. It works as a running guestbook that keeps collecting messages for weeks or months afterward, not just during the event itself, so latecomers and out-of-town relatives don't miss the window.",
    ],
    tips: [
      "A specific memory of the couple together tends to mean more than a generic well-wish.",
      "If you can't attend, say so and add why you're happy for them anyway.",
      "Photos of the couple from before the wedding (not just wedding-day snaps) add real texture.",
      "Keep advice light-handed unless it's been specifically asked for.",
    ],
    faqs: [
      { q: "Can guests add photos from the wedding itself?", a: "Yes — guests can post photos and short videos alongside their messages, both before and after the event." },
      { q: "Is there a deadline for posting?", a: "No fixed deadline — the board stays open for as long as you'd like it to keep collecting messages." },
      { q: "Can we use this instead of a physical guestbook?", a: "Many couples use it alongside a physical book so remote guests aren't left out entirely." },
      { q: "Can we choose a theme that matches our wedding colors?", a: "Yes — pick from a set of curated themes, each with its own palette and typography." },
    ],
  },
  "new-baby": {
    intro: [
      "News of a new baby travels fast, but well-wishes tend to arrive scattered across texts, calls, and comments the parents are too exhausted to keep track of. A new-baby board gives everyone one place to leave a message, and gives the parents one page to return to — during the newborn blur or years later.",
      "Share the link once the announcement goes out, and let family and friends add their own notes, photos of gifts they're sending, or just a line of encouragement. It's low-effort for contributors and genuinely useful for parents who won't have the bandwidth to reply to everyone individually in the first few weeks.",
    ],
    tips: [
      "A line of practical encouragement (\"you've got this\") often lands better than advice.",
      "If you've met the baby, mention something specific you noticed.",
      "Share a photo of something you're sending, if anything, so it isn't a surprise later.",
      "Keep it warm and brief — new parents are reading this in stolen minutes.",
    ],
    faqs: [
      { q: "Can we add the baby's name and photo later?", a: "Yes — board details like the title and cover photo can be updated any time from your dashboard." },
      { q: "Do grandparents need to make an account to post?", a: "No — anyone with the link can post a message or photo without signing up." },
      { q: "Can we keep the board going after the first few weeks?", a: "Yes, there's no expiry — the board stays open and collecting for as long as you like." },
      { q: "Is the board public by default?", a: "You choose: public and indexable, unlisted (link-only), or private to invited people only." },
    ],
  },
  "work-anniversary": {
    intro: [
      "Work anniversaries are easy to let pass quietly, especially on remote or hybrid teams where there's no hallway to gather in. A work-anniversary board lets a manager or teammate collect appreciation from across the team — including people in other offices or time zones — without organizing a meeting or a card that has to physically travel desk to desk.",
      "Create the board, share it in the team channel, and let colleagues add a note about what they've valued working alongside this person. It reads as considerably more thoughtful than a single Slack message, and it gives the recipient something they can actually keep.",
    ],
    tips: [
      "Reference a specific project or moment you worked on together.",
      "Keep the tone genuine rather than purely professional — specifics over titles.",
      "If you're their manager, this is a good place to note growth you've watched happen.",
      "Encourage the wider team to contribute, not just the immediate group — it broadens the picture.",
    ],
    faqs: [
      { q: "Can we restrict the board to just our company?", a: "You can set the board to unlisted or private so only people with the link (or invited people) can view or post." },
      { q: "Can a manager present this during a team meeting?", a: "Yes — slideshow mode plays the board fullscreen, which works well for presenting during a call or gathering." },
      { q: "Will it look too casual for a corporate setting?", a: "Themes range from warm and celebratory to clean and understated — pick whichever fits your team's tone." },
      { q: "Can multiple people from the team help moderate it?", a: "Currently one owner account manages each board; multi-admin support is on the roadmap." },
    ],
  },
  farewell: {
    intro: [
      "When someone leaves a job, a team, or a city, there's usually a flurry of goodbyes packed into one final day — which means most of what people actually want to say gets rushed or forgotten. A farewell board removes the time pressure: people can add their message whenever it comes to them, over days rather than one afternoon.",
      "Set it up as soon as you know someone's leaving, share the link with the team or friend group, and let it fill up before their last day. It becomes something they can actually sit down and read properly, rather than a stack of hastily signed cards.",
    ],
    tips: [
      "Name something specific you'll miss — a habit, a joke, a way they worked.",
      "It's fine to be a little sentimental here; farewells are one of the places it's earned.",
      "If you have a photo together, add it — these boards become keepsakes.",
      "Wish them well specifically for what's next, if you know what that is.",
    ],
    faqs: [
      { q: "Can we time the reveal for their last day?", a: "Yes — keep the board collecting privately and share the link with the recipient whenever you're ready." },
      { q: "Is this appropriate for a work farewell, not just personal ones?", a: "Yes — the warm, understated themes suit workplace farewells as well as personal ones." },
      { q: "Can people who've already left the company still contribute?", a: "Yes — anyone with the link can post, whether or not they're still on the team." },
      { q: "Can we add a group photo as the cover image?", a: "Yes — the board owner can set a cover image from the dashboard." },
    ],
  },
  retirement: {
    intro: [
      "A retirement caps off years, sometimes decades, of working alongside people — which is a lot more than a single farewell party can properly hold. A retirement board lets current colleagues, former teammates, and people who've since moved on all add their own reflection, without needing to coordinate a reunion to do it.",
      "Create the board ahead of the retirement date and share it widely — including with people who've left the company but overlapped with the retiree at some point. The result is often a much fuller picture of someone's career than any single speech could cover.",
    ],
    tips: [
      "A specific story from working together outlasts a generic \"congrats on retirement.\"",
      "If they mentored you, say what you carried forward from it.",
      "It's a good place to note the arc of their career, if you've watched it happen.",
      "Encourage people from earlier chapters of their career to contribute, not just recent colleagues.",
    ],
    faqs: [
      { q: "Can former employees who've left the company post here?", a: "Yes — anyone with the link can contribute, regardless of whether they still work there." },
      { q: "Can this be presented at a retirement party?", a: "Yes — slideshow mode plays the board fullscreen, which works well at an in-person gathering." },
      { q: "How far back can we invite people from?", a: "As far back as you'd like — there's no limit on how many people can be invited or how long the board stays open." },
      { q: "Can we print it out afterward?", a: "A print/keepsake export isn't available yet, but the board itself stays live and accessible indefinitely." },
    ],
  },
  "get-well": {
    intro: [
      "When someone is recovering from an illness or surgery, a wave of individual texts and calls can be more tiring to respond to than comforting. A get-well board gives people one place to leave encouragement, so the person recovering can read it at their own pace — all at once, or a little at a time — without feeling obligated to reply to each one.",
      "The tone here matters: this is deliberately one of the gentler themes, without confetti or celebratory motion. Share the link with family, friends, and coworkers, and let the messages accumulate quietly in the background while they focus on recovering.",
    ],
    tips: [
      "Keep it warm and light — you don't need to address the illness directly if that doesn't feel right.",
      "Offer something specific and low-effort you're happy to help with, if appropriate.",
      "A short, calm message is often easier to receive than a long one when someone's unwell.",
      "It's okay to just say you're thinking of them — that alone carries weight.",
    ],
    faqs: [
      { q: "Is this appropriate for a serious illness, not just a minor one?", a: "Yes — the theme is intentionally gentle and calm, without celebratory effects, and suits a range of situations." },
      { q: "Can the board stay private to close family and friends?", a: "Yes — set visibility to unlisted or private so only people with the link, or invited people, can see it." },
      { q: "Can we keep adding messages over a longer recovery?", a: "Yes, there's no time limit — the board stays open for as long as you need it to." },
      { q: "Who can moderate what gets posted?", a: "The board owner can hide or delete any post, and anyone can report a post for review." },
    ],
  },
  "thank-you": {
    intro: [
      "Some thank-yous are too big for a single card — a teacher at the end of the year, a team that pulled together on a hard project, a mentor who gave more than the job required. A thank-you board lets everyone who benefited add their own note, so the person being thanked sees the full scope of the impact they had, not just one person's version of it.",
      "Create the board, share the link with everyone involved, and let the appreciation gather. It works particularly well for group efforts — a class, a team, a volunteer group — where no single message could capture what everyone individually wants to say.",
    ],
    tips: [
      "Say specifically what they did, not just that you're grateful.",
      "If it changed how you approached something, say so — it's the kind of detail people remember.",
      "Group contributions well — a class or team's messages together carry more weight than one.",
      "Keep it genuine over grand; specific beats effusive.",
    ],
    faqs: [
      { q: "Can a whole class or team contribute to one board?", a: "Yes — there's no limit on contributors, which makes it well suited to group thank-yous." },
      { q: "Can we add a group photo?", a: "Yes — contributors can attach photos to their individual messages, and the owner can set a cover image." },
      { q: "Is there a cost for larger groups?", a: "No — creating a board and collecting messages is free regardless of how many people contribute." },
      { q: "Can we present it at an end-of-year event?", a: "Yes — slideshow mode plays the board fullscreen, which works well for presenting at an event." },
    ],
  },
  memorial: {
    intro: [
      "When someone dies, the people who loved them are often spread across cities, time zones, and stages of their lives — coworkers who never met the childhood friends, family who never met the college roommates. A memorial page gives all of them one place to leave a memory, so the family is left with something to hold onto that's fuller than any single eulogy could be.",
      "This is deliberately the quietest, most understated theme in Wishwell — no confetti, no bouncing animation, nothing that could feel out of place. It's built to hold weight, not to entertain. The page stays open indefinitely; there's no expiry date on grief or on remembering someone.",
    ],
    tips: [
      "A specific memory, however small, is usually more meaningful than a general statement of loss.",
      "It's alright if what you write is short — length isn't what makes it matter.",
      "If you have a photo of them, especially an unposed one, it's often treasured.",
      "There's no need to explain your relationship in detail — just share what you remember.",
    ],
    faqs: [
      { q: "Is this page appropriate for a public tribute?", a: "Yes — you can make it public so it's easy to find and share, or private for close family and friends only." },
      { q: "Does the page expire?", a: "No — memorial pages stay open indefinitely, with no closing date." },
      { q: "Can family members moderate what's posted?", a: "Yes — the board owner can hide or delete any post, and anyone can report one for review." },
      { q: "Is there any celebratory animation on this theme?", a: "No — the memorial theme is deliberately still and quiet. There is never confetti or bouncing motion on this page." },
    ],
  },
};
