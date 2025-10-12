import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  title: "WalkPerro — Tools, Templates, Systems",
  description: "Clean, minimal tools that turn ambition into results.",
  metadataBase: new URL("https://walkperro.com"),
  openGraph: {
    title: "WalkPerro",
    description: "Clean, minimal tools that turn ambition into results.",
    url: "https://walkperro.com",
    siteName: "WalkPerro",
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkPerro",
    description: "Clean, minimal tools that turn ambition into results.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="min-h-dvh bg-white text-black antialiased">
        {children}
        {/* Lemon Squeezy modal script can go here when approved: */}
        {/* <script src="https://app.lemonsqueezy.com/js/lemon.js" defer></script> */}
      </body>
    </html>
  );
}
