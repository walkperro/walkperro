import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GaPayhipBridge from "@/components/GaPayhipBridge";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://walkperro.com"),
  title: "WalkPerro — The Exhibit",
  description: "Luxury minimal tools, digital playbooks, and systems for those who lead the pack.",
  keywords: [
    "WalkPerro",
    "luxury digital products",
    "side hustle guides",
    "ChatGPT money prompts",
    "faceless social media",
    "WalkPerro Exhibit",
    "Money Moves Toolkit",
    "Wealth Hacks",
  ],
  authors: [{ name: "WalkPerro", url: "https://walkperro.com" }],
  creator: "WalkPerro",
  publisher: "WalkPerro",
  openGraph: {
    title: "WalkPerro — The Exhibit",
    description: "Luxury minimal tools for those who lead the pack.",
    url: "https://walkperro.com",
    siteName: "WalkPerro",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "WalkPerro — The Exhibit" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkPerro — The Exhibit",
    description: "Luxury minimal tools for those who lead the pack.",
    images: ["/og.svg"],
    creator: "@walkperro",
  },
  alternates: { canonical: "https://walkperro.com" },
  other: {
    "og:see_also:instagram": "https://instagram.com/walkperro",
    "og:see_also:tiktok": "https://tiktok.com/@walkperro",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-ink text-bone">
      <head>
        <script src="https://payhip.com/payhip.js" async></script>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className={`${inter.variable} ${playfair.variable} min-h-dvh antialiased`}>
        <GoogleAnalytics />
        <VercelAnalytics />
        <GaPayhipBridge />
        {children}
      </body>
    </html>
  );
}
