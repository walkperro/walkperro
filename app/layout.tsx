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
  title: "walkperro — operator's hub for the AI era",
  description:
    "Tools, opinions, and field notes from one person doing what used to take a team. Read. Build. Steal.",
  openGraph: {
    title: "walkperro",
    description: "Operator's hub for the AI/vibe-coding era.",
    url: "https://www.walkperro.com",
    siteName: "walkperro",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${serif.variable} ${mono.variable} ${sans.variable}`}>
      <body className="bg-bone text-charcoal font-sans antialiased">
        <ScrollReveal />
        {children}
      </body>
    </html>
  );
}
