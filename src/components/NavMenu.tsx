"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function DogHouseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {/* roof */}
      <path d="M3 11.5L12 4l9 7.5" stroke="none" fill="currentColor" opacity="0.92" />
      {/* house body */}
      <path d="M6.5 10.8V21h11V10.8" stroke="none" fill="currentColor" opacity="0.92" />
      {/* door */}
      <path d="M11 21v-6h2v6" fill="#000" opacity="0.55" />
      {/* paw circle */}
      <circle cx="12" cy="14.5" r="1" fill="#000" opacity="0.55" />
    </svg>
  );
}

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="navRoot" aria-label="Primary navigation">
      <div className="navBar">
        <Link href="/" className="navHomeIcon" aria-label="Home">
          <DogHouseIcon />
        </Link>

        <button
          type="button"
          className="navMenuBtn"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>
      </div>

      {/* overlay to close on outside tap */}
      {open && <button className="navOverlay" aria-label="Close menu" onClick={() => setOpen(false)} />}

      <div ref={panelRef} className={`navPanel ${open ? "open" : ""}`} role="menu">
        <Link className="navItem" href="/services" role="menuitem" onClick={() => setOpen(false)}>
          Services
        </Link>
        <Link className="navItem" href="/#inquiry" role="menuitem" onClick={() => setOpen(false)}>
          Contact
        </Link>
        <Link className="navItem" href="/policy" role="menuitem" onClick={() => setOpen(false)}>
          Policy
        </Link>
        <Link className="navItem" href="/faq" role="menuitem" onClick={() => setOpen(false)}>
          FAQ
        </Link>
      </div>
    </div>
  );
}
