import type { Metadata } from "next";
import "./globals.css";
import NavMenu from "@/components/NavMenu";
import PublicSiteFooter from "@/components/public/PublicSiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://walkperro.com"),
  title: {
    default: "WalkPerro | Editorial Websites, Visuals, and AI Systems",
    template: "%s | WalkPerro",
  },
  description:
    "WalkPerro builds editorial websites, premium visuals, and AI-enhanced systems for modern brands and service businesses.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://walkperro.com",
    title: "WalkPerro | Editorial Websites, Visuals, and AI Systems",
    description:
      "Editorial websites, premium visuals, and AI systems built with clarity and intention.",
    siteName: "WalkPerro",
    images: [
      {
        url: "/images/editorial/hero-office-landscape.png",
        width: 1536,
        height: 1024,
        alt: "WalkPerro editorial website design studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkPerro | Editorial Websites, Visuals, and AI Systems",
    description:
      "Editorial websites, premium visuals, and AI systems built with clarity and intention.",
    images: ["/images/editorial/hero-office-landscape.png"],
  },
  icons: {
    icon: [{ url: "/perro/white_perro_v2_no_bg.png", sizes: "500x500", type: "image/png" }],
    apple: [{ url: "/perro/white_perro_v2.png", sizes: "1024x1024", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavMenu />
        {children}
        <PublicSiteFooter />
      </body>
    </html>
  );
}
