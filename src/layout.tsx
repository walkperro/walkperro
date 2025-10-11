import type { Metadata } from "next";
import "./globals.css";
import { site } from "./site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: "Faceless systems, AI-powered tools, and templates to stack cashflow.",
  metadataBase: new URL("https://walkperro.com"),
  openGraph: {
    title: site.name,
    description: "Tools to fast-track your vision.",
    images: [site.ogImage],
  },
  twitter: { card: "summary_large_image", site: site.twitter },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-zinc-900 antialiased">{children}</body>
    </html>
  );
}
