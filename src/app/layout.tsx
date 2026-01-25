import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WalkPerro",
  description: "Digital systems for modern businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
