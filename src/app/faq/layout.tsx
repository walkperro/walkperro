import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about WalkPerro services and project process.",
  alternates: { canonical: "/faq" },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
