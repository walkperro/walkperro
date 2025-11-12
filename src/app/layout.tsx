import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "WalkPerro — The Exhibit",
  description: "Luxury minimal tools for those who lead the pack.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "WalkPerro — The Exhibit",
    description: "Luxury minimal tools for those who lead the pack.",
    url: "https://walkperro.com",
    siteName: "WalkPerro",
    images: [{ url: "/og.svg", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkPerro — The Exhibit",
    description: "Luxury minimal tools for those who lead the pack.",
    images: ["/og.svg"],
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
        {children}
      </body>
    </html>
  );
}
