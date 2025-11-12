import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "WalkPerro — The Exhibit",
  description: "Luxury minimal tools for those who lead the pack.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-ink text-bone">
      <head>
        <script src="https://payhip.com/payhip.js" async></script>
      </head>
      <body className={`${inter.variable} ${playfair.variable} min-h-dvh antialiased`}>
        {children}
      </body>
    </html>
  );
}
