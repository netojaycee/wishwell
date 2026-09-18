// Brand facts shared by structured data (root layout, About page) and /llms.txt, so Google,
// AI assistants and the site itself all describe Fondly Held the same way. Consistency of
// these facts across the web is what lets search engines treat "Fondly Held" as an entity.
export const BRAND: {
  name: string;
  alternateNames: string[];
  description: string;
  email: string;
  founder: { name: string; jobTitle: string; image: string; country: string };
  socialProfiles: string[];
} = {
  name: "Fondly Held",
  // People will type it as one word ("fondlyheld"), tell search engines it's the same brand.
  alternateNames: ["FondlyHeld"],
  description:
    "One link, everyone contributes. Beautiful group cards and tribute pages for every occasion, free, no signup required to post.",
  email: "netojaycee@gmail.com",
  founder: {
    name: "John Chinonso Edeh",
    jobTitle: "Founder",
    image: "/images/founder.webp",
    country: "Nigeria",
  },
  // Official profiles under the exact name "Fondly Held" (X, LinkedIn, Instagram, …). Add
  // each URL here once it exists: they become schema.org `sameAs`, which is how Google ties
  // the brand to its profiles. Leave empty rather than listing profiles that don't exist.
  socialProfiles: [],
};
