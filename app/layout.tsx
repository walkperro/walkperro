import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "WalkPerro Exhibit – Luxury-Minimal Hustle Systems",
  description:
    "Luxury-minimal digital systems for side hustlers, ghosts and quiet killers who want clean tools, not chaos. Built for relentless cashflow.",
  metadataBase: new URL("https://walkperro.com"),
  openGraph: {
    title: "WalkPerro Exhibit",
    description:
      "Clean, focused digital products for $100 days, faceless cashflow and fast flips.",
    url: "https://walkperro.com",
    siteName: "WalkPerro",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkPerro – For those who lead the pack.",
    description:
      "Minimal, aggressive, cashflow-focused systems. No guru noise.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} min-h-dvh bg-ink text-bone`}
      >
        <GoogleAnalytics />
        {children}
        <VercelAnalytics />
      </body>
    </html>
  );
}
