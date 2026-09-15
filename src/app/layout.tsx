import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Fraunces,
  Instrument_Serif,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

// Body sans — clean, quiet, does not compete with the theme's headline serif.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Headline serifs — a per-board theme picks one of these three; each does most of the
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

export const metadata: Metadata = {
  title: {
    default: "Fondly Held — beautiful group cards for every occasion",
    template: "%s · Fondly Held",
  },
  description:
    "One link, everyone contributes. Beautiful group cards and tribute pages for every occasion — free, no signup required to post.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Fondly Held",
  url: process.env.NEXT_PUBLIC_APP_URL,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Fondly Held",
  url: process.env.NEXT_PUBLIC_APP_URL,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} ${instrumentSerif.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        {children}
      </body>
    </html>
  );
}
