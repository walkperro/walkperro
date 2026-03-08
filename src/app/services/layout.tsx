import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Ways to work with WalkPerro across editorial visuals, websites, business systems, and custom creative direction.",
  alternates: { canonical: "/services" },
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
