import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import ScrollReveal from "@/components/ScrollReveal";

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.walkperro.com"),
  title: {
    default: "walkperro — for the ones who do.",
    template: "%s — walkperro",
  },
  description:
    "walkperro builds with ai from the ground up — closehound for sec8 housing sellers, asere for spanish fluency, 1k2rich trading bot, ga/fl real estate study app. plus websites, seo, ad creative, and ai workflows for clients.",
  keywords: [
    "AI builder", "build with AI", "Claude", "prompt engineering",
    "field notes", "solo builder", "AI tools", "vibe coding",
    "indie maker", "Stripe", "Supabase", "Next.js",
    // homepage v2 products + services
    "closehound", "asere", "1k2rich",
    "section 8 housing", "real estate georgia florida",
    "spanish learning miami", "trading bot",
    "custom website", "seo", "ad creative",
  ],
  authors: [{ name: "walkperro" }],
  creator: "walkperro",
  publisher: "walkperro",
  alternates: {
    canonical: "https://www.walkperro.com",
    types: {
      "application/rss+xml": [
        { url: "/log/rss.xml", title: "walkperro / log" },
      ],
    },
  },
  openGraph: {
    title: "walkperro — for the ones who do.",
    description:
      "closehound, asere, 1k2rich, ga/fl real estate study app — products + websites + ai workflows from a builder shipping from the ground floor.",
    url: "https://www.walkperro.com",
    siteName: "walkperro",
    type: "website",
    images: [
      { url: "/og.png", width: 1200, height: 630, alt: "walkperro" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "walkperro — for the ones who do.",
    description:
      "closehound, asere, 1k2rich, ga/fl real estate study app — products + websites + ai workflows from a builder shipping from the ground floor.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Google Search Console site verification — the service account in
    // scripts/gsc-verify.mjs issues this token and self-verifies, so the
    // Indexing API will accept submissions for walkperro.com without
    // needing a manual UI step. Env var is set by `gsc-verify.mjs token`.
    google: process.env.GOOGLE_SITE_VERIFICATION_TOKEN,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.walkperro.com/#org",
        name: "walkperro",
        url: "https://www.walkperro.com",
        logo: {
          "@type": "ImageObject",
          url: "https://www.walkperro.com/icon-512.png",
          width: 512,
          height: 512,
        },
        sameAs: ["https://instagram.com/walkperro"],
      },
      {
        "@type": "WebSite",
        "@id": "https://www.walkperro.com/#site",
        url: "https://www.walkperro.com",
        name: "walkperro",
        publisher: { "@id": "https://www.walkperro.com/#org" },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://www.walkperro.com/log?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <html lang="en" className={`${serif.variable} ${mono.variable} ${sans.variable}`}>
      <body className="bg-bone text-charcoal font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
