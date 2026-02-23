import type { Metadata } from "next";
import "./globals.css";
import NavMenu from "@/components/NavMenu";

export const metadata: Metadata = {
  metadataBase: new URL("https://walkperro.com"),
  title: {
    default: "WalkPerro | Websites and Conversion Systems",
    template: "%s | WalkPerro",
  },
  description:
    "WalkPerro designs websites, admin dashboards, and conversion systems for modern businesses.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://walkperro.com",
    title: "WalkPerro | Websites and Conversion Systems",
    description:
      "Websites, dashboards, SEO, analytics, and paid growth systems built to convert.",
    siteName: "WalkPerro",
    images: [
      {
        url: "/perro/white_perro_v2.png",
        width: 1024,
        height: 1024,
        alt: "WalkPerro",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WalkPerro | Websites and Conversion Systems",
    description:
      "Websites, dashboards, SEO, analytics, and paid growth systems built to convert.",
    images: ["/perro/white_perro_v2.png"],
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
        <footer className="siteFooter">
          <div className="siteFooterInner">
            <p className="siteFooterBrand">WalkPerro</p>
            <p className="siteFooterMeta">Digital systems for modern businesses.</p>
            <div className="siteFooterLinks">
              <a href="/policy">Privacy & Terms</a>
              <a href="/faq">FAQ</a>
              <a href="/contact">Contact</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
