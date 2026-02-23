import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy & Terms",
  description: "WalkPerro privacy, terms, and website use policy.",
  alternates: { canonical: "/policy" },
};

export default function PolicyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
