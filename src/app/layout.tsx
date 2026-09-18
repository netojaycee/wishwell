import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Fraunces,
  Instrument_Serif,
  Playfair_Display,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { BRAND } from "@/lib/brand";
import "./globals.css";
import { JsonLd } from "@/components/seo/json-ld";

// Body sans, clean, quiet, does not compete with the theme's headline serif.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Headline serifs, a per-board theme picks one of these three; each does most of the
// emotional work for its motion profile (see DESIGN.md). next/font requires static
// imports, so the full curated set loads once here and boards select by CSS variable.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;
const TITLE = "Fondly Held, beautiful group cards for every occasion";
const DESCRIPTION =
  "One link, everyone contributes. Beautiful group cards and tribute pages for every occasion, free, no signup required to post.";

export const metadata: Metadata = {
  // Without this, relative OG image URLs (like the ones next/og generates) can't
  // resolve to absolute URLs, and crawlers (WhatsApp, Slack, iMessage) may fail to
  // fetch the preview image at all.
  metadataBase: APP_URL ? new URL(APP_URL) : undefined,
  title: {
    default: TITLE,
    template: "%s · Fondly Held",
  },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    siteName: "Fondly Held",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  // Search Console / Bing Webmaster ownership tags (GROWTH.md technical SEO checklist),
  // set the env vars to the tags' content values, redeploy, then verify in each console.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
  },
};

// Brand entity for search engines and AI assistants: name (+ the one-word spelling people
// type), logo, description, founder and, once they exist, official profiles (sameAs).
// Facts live in src/lib/brand.ts so the About page and /llms.txt say exactly the same.
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${APP_URL}/#organization`,
  name: BRAND.name,
  alternateName: BRAND.alternateNames,
  url: `${APP_URL}/`,
  logo: { "@type": "ImageObject", url: `${APP_URL}/logo.png`, width: 512, height: 512 },
  description: BRAND.description,
  email: BRAND.email,
  founder: { "@type": "Person", "@id": `${APP_URL}/about#founder`, name: BRAND.founder.name },
  foundingLocation: { "@type": "Place", name: BRAND.founder.country },
  ...(BRAND.socialProfiles.length > 0 ? { sameAs: BRAND.socialProfiles } : {}),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${APP_URL}/#website`,
  name: BRAND.name,
  alternateName: BRAND.alternateNames,
  url: `${APP_URL}/`,
  description: BRAND.description,
  inLanguage: "en",
  publisher: { "@id": `${APP_URL}/#organization` },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${instrumentSerif.variable} ${playfair.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: extensions like Grammarly stamp data-* attributes on
          <body> before hydration, which otherwise surfaces as a dev "hydration mismatch".
          Only affects this element's own attributes, not its children. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={websiteJsonLd} />
        {children}
        {/* Page views (GROWTH.md §6). No-op until Web Analytics is enabled in the Vercel project. */}
        <Analytics />
      </body>
    </html>
  );
}
