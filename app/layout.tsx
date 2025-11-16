import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "WalkPerro — Luxury-minimal tools for relentless cashflow",
  description:
    "Digital systems, playbooks and prompt packs for builders, ghosts and quiet killers who move with taste.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} bg-[#03030b] text-slate-100 antialiased`}
      >
        <div className="font-sans min-h-dvh bg-[radial-gradient(circle_at_top,_#020617,_#020013_45%,_#000)] text-slate-100">
          {children}
        </div>
      </body>
    </html>
  );
}
