// Curated imagery for marketing/showcase surfaces: real photos (Unsplash licence,
// self-hosted in /public/images/moments for LCP) and illustrated GIFs (hotlinked from
// GIPHY per their API terms, credited in the footer). Everything here is *illustrative
// demo content* showing what a board looks like — never present it as testimonials or
// real users (GROWTH.md §3). Keyed by OccasionType.key with a fallback, so adding an
// occasion row still renders without a deploy (CLAUDE.md rule 1).

export type Photo = { src: string; alt: string; credit: string };
export type Gif = { src: string; alt: string };

export const PHOTOS = {
  birthdayCandles: { src: "/images/moments/birthday-candles.webp", alt: "Birthday cake with lit candles spelling Happy Bday", credit: "Bhaumik Shrivastava" },
  birthdayFriends: { src: "/images/moments/birthday-friends.webp", alt: "Friends laughing together around a dinner table", credit: "Jim Nyamao" },
  friendsLaughing: { src: "/images/moments/friends-laughing.webp", alt: "Three friends laughing and hugging outdoors", credit: "Brian Kungu" },
  farewellHug: { src: "/images/moments/farewell-hug.webp", alt: "Two friends sharing a warm hug", credit: "Gabriel Tovar" },
  farewellOffice: { src: "/images/moments/farewell-office.webp", alt: "A smiling woman carrying a box of belongings out of the office", credit: "Vitaly Gariev" },
  congratsGraduate: { src: "/images/moments/congrats-graduate.webp", alt: "A graduate throwing a cap into the air", credit: "Christian Agbede" },
  memorialVintage: { src: "/images/moments/memorial-vintage.webp", alt: "An old sepia photograph of a woman smiling at a baby", credit: "Arno Senoner" },
  memorialCandle: { src: "/images/moments/memorial-candle.webp", alt: "A lit candle beside white roses", credit: "Quilia" },
  memorialPortrait: { src: "/images/moments/memorial-portrait.webp", alt: "Black and white portrait of an elderly woman smiling", credit: "Annie Spratt" },
  babyFeet: { src: "/images/moments/baby-feet.webp", alt: "A parent's hands cradling a newborn's feet", credit: "Omar Lopez" },
  babyParents: { src: "/images/moments/baby-parents.webp", alt: "New parents smiling down at their newborn", credit: "Kelly Sikkema" },
  retirementSmile: { src: "/images/moments/retirement-smile.webp", alt: "An older man with glasses laughing warmly", credit: "Age Cymru" },
  retirementBench: { src: "/images/moments/retirement-bench.webp", alt: "A couple sitting on a bench looking out to sea", credit: "Matt Bennett" },
  getwellFlowers: { src: "/images/moments/getwell-flowers.webp", alt: "Yellow flowers and a mug of tea beside a handwritten note", credit: "Susan Weber" },
  thankyouFlowers: { src: "/images/moments/thankyou-flowers.webp", alt: "Hands holding a heart-shaped bouquet of flowers", credit: "Shamblen Studios" },
  weddingCouple: { src: "/images/moments/wedding-couple.webp", alt: "A smiling bride and groom holding a bouquet", credit: "Filip Rankovic Grobgaard" },
  weddingEmbrace: { src: "/images/moments/wedding-embrace.webp", alt: "A couple resting their heads together, holding flowers", credit: "Phuong Nguyen" },
  workHighfive: { src: "/images/moments/work-highfive.webp", alt: "Two colleagues high-fiving at their desks", credit: "Vitaly Gariev" },
  teamFriends: { src: "/images/moments/team-friends.webp", alt: "Four friends standing together smiling", credit: "Kingsley Osei-Abrah" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof PHOTOS;

export const GIFS = {
  birthdayCake: { src: "https://media.giphy.com/media/3o6ZtkMajLUNKqWj5K/200w.gif", alt: "Animated slice of birthday cake with a candle" },
  congrats: { src: "https://media.giphy.com/media/0SHm8dHlntiBDqgY5T/200w.webp", alt: "Animated hand-lettered Congrats" },
  thankYou: { src: "https://media.giphy.com/media/L9Q2rzzBHrfv4a1y4h/200w.webp", alt: "A little cartoon chick bowing thank you" },
  missYou: { src: "https://media.giphy.com/media/dta6q4Q8jrEzHtVCiL/200w.webp", alt: "Animated lettering: We'll miss you" },
  heartHands: { src: "https://media.giphy.com/media/4W1GQ46T5NX4PeVKxz/200w.webp", alt: "Two open hands with small hearts floating up" },
} satisfies Record<string, Gif>;

export type GifKey = keyof typeof GIFS;

export type DemoPost = { author: string; body: string; photo?: PhotoKey; gif?: GifKey };

export type Showcase = {
  recipient: string;
  title: string;
  slug: string;
  cover: PhotoKey;
  posts: DemoPost[];
};

export const occasionShowcase: Record<string, Showcase> = {
  birthday: {
    recipient: "Tolu",
    title: "Tolu turns 30",
    slug: "tolu-turns-30",
    cover: "birthdayCandles",
    posts: [
      { author: "Dara", body: "Thirty looks good on you. Here's to many more long dinners like this one.", photo: "birthdayFriends" },
      { author: "Kemi", body: "Cake emergency, on its way 🎂", gif: "birthdayCake" },
      { author: "Mide", body: "You made this year so much lighter for all of us. Happy birthday, Tolu!" },
    ],
  },
  congratulations: {
    recipient: "Ada",
    title: "Congrats, Dr. Ada!",
    slug: "congrats-dr-ada",
    cover: "congratsGraduate",
    posts: [
      { author: "Chidi", body: "Six years of late nights and you did it. So proud of you.", photo: "congratsGraduate" },
      { author: "Zainab", body: "DOCTOR. Ada. I will be saying it all week.", gif: "congrats" },
      { author: "Uncle Femi", body: "Watching you work for this was a masterclass in not giving up." },
    ],
  },
  wedding: {
    recipient: "Seun & Lara",
    title: "Seun & Lara's wedding",
    slug: "seun-and-lara",
    cover: "weddingCouple",
    posts: [
      { author: "Ife", body: "You two make it look effortless. Wishing you a lifetime of this.", photo: "weddingCouple" },
      { author: "The Bakare family", body: "Still thinking about that first dance.", photo: "weddingEmbrace" },
      { author: "Aunty Bisi", body: "Welcome to the family, Lara. We have been waiting for you." },
    ],
  },
  "new-baby": {
    recipient: "Amara",
    title: "Welcome, little Amara",
    slug: "welcome-amara",
    cover: "babyFeet",
    posts: [
      { author: "Grandma Joy", body: "Ten tiny toes, and already running the house.", photo: "babyFeet" },
      { author: "Tunde & Ify", body: "You two are naturals. Sleep when you can!", photo: "babyParents" },
      { author: "Nneka", body: "Can't wait to meet her. Sending all the love to the three of you." },
    ],
  },
  "work-anniversary": {
    recipient: "Chinedu",
    title: "10 years with Chinedu",
    slug: "chinedu-10-years",
    cover: "workHighfive",
    posts: [
      { author: "Grace", body: "Ten years and you still make Monday stand-ups fun.", photo: "workHighfive" },
      { author: "The Lagos office", body: "Thank you for building this with us, one Friday at a time.", photo: "teamFriends" },
      { author: "Obinna", body: "You hired me, trained me, and never once made me feel new. Happy tenth." },
    ],
  },
  farewell: {
    recipient: "Rachel",
    title: "Farewell, Rachel",
    slug: "farewell-rachel",
    cover: "farewellHug",
    posts: [
      { author: "Funmi", body: "The office won't be the same without our morning chats.", photo: "farewellHug" },
      { author: "Design team", body: "Come back and visit. Often.", gif: "missYou" },
      { author: "The whole team", body: "We'll miss you at the office, but great things are ahead. Go make it count." },
    ],
  },
  retirement: {
    recipient: "Mr. Adeyemi",
    title: "Happy retirement, Mr. Adeyemi",
    slug: "mr-adeyemi-retires",
    cover: "retirementSmile",
    posts: [
      { author: "Bola", body: "Thirty-two years, and you never once forgot anyone's name. Enjoy every sunrise.", photo: "retirementSmile" },
      { author: "Kunle", body: "The seaside mornings start Monday. No excuses.", photo: "retirementBench" },
      { author: "Efe", body: "You taught me more in my first year than school did in four. Thank you, sir." },
    ],
  },
  "get-well": {
    recipient: "Ngozi",
    title: "Get well soon, Ngozi",
    slug: "get-well-ngozi",
    cover: "getwellFlowers",
    posts: [
      { author: "Amaka", body: "Rest, read, and let everyone else do the dishes for once.", photo: "getwellFlowers" },
      { author: "Choir family", body: "Thinking of you every single day.", gif: "heartHands" },
      { author: "Your book club", body: "No rush to reply to anything. We're here whenever you're ready." },
    ],
  },
  "thank-you": {
    recipient: "Mrs. Okafor",
    title: "Thank you, Mrs. Okafor",
    slug: "thank-you-mrs-okafor",
    cover: "thankyouFlowers",
    posts: [
      { author: "Class of 2026", body: "For every extra lesson you never had to give. Thank you.", photo: "thankyouFlowers" },
      { author: "Tobi", body: "THANK YOU!!!", gif: "thankYou" },
      { author: "Adaeze", body: "You made us believe we were good at maths. Some of us even are now." },
    ],
  },
  memorial: {
    recipient: "Grandma Rose",
    title: "In loving memory of Grandma Rose",
    slug: "remembering-grandma-rose",
    cover: "memorialCandle",
    posts: [
      { author: "Ellie", body: "My favourite picture of her, holding me and laughing at something just out of frame.", photo: "memorialVintage" },
      { author: "Aunty Blessing", body: "Thinking of you today and always. She would be so proud of all of you." },
      { author: "Daniel", body: "Lit a candle for her this morning. Her kitchen was always open, and so was her heart.", photo: "memorialCandle" },
    ],
  },
};

// The three example boards seeded by `pnpm db:seed-demo` (src/db/seed-demo.ts) and linked
// from the home page — one per motion profile. Their slugs are the showcase slugs, so the
// URL shown in each DemoBoard's window chrome is the real example page.
export const EXAMPLE_BOARD_KEYS = ["birthday", "farewell", "memorial"] as const;

export function exampleBoardSlug(occasionKey: string): string | undefined {
  return (EXAMPLE_BOARD_KEYS as readonly string[]).includes(occasionKey) ? occasionShowcase[occasionKey]?.slug : undefined;
}

// Unknown keys (a newly added occasion row) fall back by motion profile, so a new solemn
// occasion never borrows the birthday showcase's confetti-toned content.
export function showcaseFor(occasionKey: string, profile?: "celebratory" | "warm" | "solemn"): Showcase {
  const fallback = profile === "solemn" ? "memorial" : profile === "warm" ? "thank-you" : "birthday";
  return occasionShowcase[occasionKey] ?? occasionShowcase[fallback];
}

// Unique photographers, for the footer credit line.
export const PHOTO_CREDITS = Array.from(new Set(Object.values(PHOTOS).map((p) => p.credit)));
