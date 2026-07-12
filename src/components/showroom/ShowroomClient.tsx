"use client";

// Decides whether the WebGL corridor mounts, and manages the "browse as a
// list" toggle. The server-rendered grid arrives as `gridSlot` (children) —
// it is ALWAYS in the DOM (SEO/a11y contract); when the tour is active it
// collapses behind the toggle via CSS only, never unmounted.
//
// Tour mounts only when: WebGL available + no prefers-reduced-motion +
// deviceMemory ≥ 4 (when reported) + section approaching viewport (IO).

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { ShowroomItem } from "@/content/showroom";

const ShowroomTour = dynamic(
  () => import("@/components/showroom/ShowroomTour"),
  { ssr: false }
);

function deviceCapable(): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return false;
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    return !!gl;
  } catch {
    return false;
  }
}

export default function ShowroomClient({
  items,
  children,
}: {
  items: ShowroomItem[];
  children: React.ReactNode; // server-rendered ShowroomGrid
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [tourState, setTourState] = useState<"pending" | "on" | "off">(
    "pending"
  );
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    if (!deviceCapable()) {
      setTourState("off");
      return;
    }
    // Lazy-mount: only load the three.js chunk when the section is within
    // ~1.5 viewports, so it never lands in the initial paint's network.
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setTourState("on");
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const tourActive = tourState === "on";

  return (
    <div ref={hostRef}>
      {tourActive && (
        <ShowroomTour items={items} onIncapable={() => setTourState("off")} />
      )}

      {/* The grid: primary view when the tour is off; collapsible list when on */}
      {tourActive ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setListOpen((v) => !v)}
            aria-expanded={listOpen}
            className="label border-b border-charcoal hover:text-charcoal transition-colors duration-snap ease-snap"
          >
            {listOpen ? "HIDE THE LIST ↑" : "BROWSE AS A LIST ↓"}
          </button>
          <div className={listOpen ? "mt-6" : "sr-only"}>{children}</div>
        </div>
      ) : (
        <div className="mt-10">{children}</div>
      )}
    </div>
  );
}
