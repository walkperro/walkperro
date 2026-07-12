"use client";

// Maps native page scroll through the tall corridor section to a 0..1
// progress value + the focused item index. No scroll hijack — the user's
// scrollbar IS the dolly. Progress updates live in a ref (read by useFrame
// without re-rendering); focusIndex is React state so the DOM overlay swaps.

import { useEffect, useRef, useState, type RefObject } from "react";

export function useTourScroll(
  sectionRef: RefObject<HTMLElement | null>,
  itemCount: number,
  onScrollTick?: () => void
) {
  const progressRef = useRef(0);
  const [focusIndex, setFocusIndex] = useState(0);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Progress: 0 when section top hits viewport top, 1 when section
      // bottom reaches viewport bottom (the sticky canvas's travel range).
      const travel = rect.height - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
      progressRef.current = p;
      const idx = Math.min(itemCount - 1, Math.round(p * (itemCount - 1)));
      setFocusIndex((prev) => (prev === idx ? prev : idx));
      onScrollTick?.();
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount]);

  return { progressRef, focusIndex };
}
