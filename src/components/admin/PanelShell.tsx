"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function PanelShell({
  email,
  title,
  children,
}: {
  email: string;
  title: string;
  children: React.ReactNode;
}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  // Lock body scroll when drawer open on mobile
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [drawerOpen]);

  return (
    <main className="min-h-dvh bg-bone text-charcoal md:flex">
      {/* Sidebar — drawer on mobile, fixed column on desktop */}
      <Sidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Backdrop — mobile only, when drawer is open */}
      {drawerOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setDrawerOpen(false)}
          className="fixed inset-0 z-30 bg-charcoal/40 md:hidden"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar email={email} title={title} onMenu={() => setDrawerOpen(true)} />
        <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1200px] w-full">{children}</div>
      </div>
    </main>
  );
}
