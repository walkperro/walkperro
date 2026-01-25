"use client";

import { useEffect, useRef, useState } from "react";

type Item = { label: string; href: string };

const items: Item[] = [
  { label: "Services", href: "/services" },
  { label: "Contact", href: "/services#inquiry" },
  { label: "Policy", href: "/policy" },
  { label: "FAQ", href: "/faq" },
];

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={ref} className="navWrap">
      <button
        type="button"
        className="navBtn"
        aria-expanded={open}
        aria-label="Menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="navIcon" />
      </button>

      {open && (
        <div className="navMenu">
          {items.map((it) => (
            <a key={it.href} href={it.href} className="navItem">
              {it.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
