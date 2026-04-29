"use client";

import { useEffect, useRef, useState, type ReactNode, type CSSProperties, type ElementType } from "react";

interface RevealProps {
  children: ReactNode;
  /** Delay in ms before the reveal animation starts (used for staggered children). */
  delay?: number;
  /** Override the default div wrapper. */
  as?: "div" | "span" | "section" | "article" | "header" | "footer";
  className?: string;
}

export function RevealOnScroll({
  children,
  delay = 0,
  as = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Fallback for environments without IntersectionObserver: reveal next tick.
    if (typeof IntersectionObserver === "undefined") {
      const t = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(t);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const style: CSSProperties | undefined = delay
    ? { transitionDelay: `${delay}ms` }
    : undefined;

  const Tag = as as ElementType;
  const finalClass = `reveal ${visible ? "is-visible" : ""} ${className}`.trim();

  return (
    <Tag ref={ref} className={finalClass} style={style}>
      {children}
    </Tag>
  );
}
