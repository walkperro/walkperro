import type { Metadata, Viewport } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://walkperro.com"),
  title: {
    default: "WalkPerro — Websites and tools that make money",
    template: "%s · WalkPerro",
  },
  description:
    "WalkPerro is a small studio. We design and engineer websites, web apps, and AI tools for operators who would rather ship than meet.",
  applicationName: "WalkPerro",
  authors: [{ name: "WalkPerro" }],
  keywords: [
    "design studio",
    "web development",
    "next.js",
    "AI automation",
    "custom software",
    "branding",
    "Claude",
  ],
  openGraph: {
    type: "website",
    title: "WalkPerro — Websites and tools that make money",
    description:
      "Design-led, AI-forward, built fast. A small studio for operators.",
    url: "https://walkperro.com",
    siteName: "WalkPerro",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "WalkPerro — websites and tools that make money",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkPerro — Websites and tools that make money",
    description:
      "Design-led, AI-forward, built fast. A small studio for operators.",
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: { url: "/apple-touch-icon.png" },
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f2efe8",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="grain antialiased">{children}</body>
    </html>
  );
}
