import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "WalkPerro services for websites, admin dashboards, SEO, GA4 analytics, and Google Ads.",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
