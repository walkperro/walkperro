import type { Metadata } from "next";
import "./globals.css";
import NavMenu from "@/components/NavMenu";

export const metadata: Metadata = {
  title: "WalkPerro",
  description: "Digital systems for modern businesses.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavMenu />
        {children}
      </body>
    </html>
  );
}
