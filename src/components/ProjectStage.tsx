"use client";

// Autoplaying CSS-only crossfade through the project hero shots. Stacked
// <img> tags fade in/out via opacity transitions on a 4s dwell. Pauses on
// hover (desktop) and on tap (mobile). Honors prefers-reduced-motion —
// renders the first slide only with controls hidden.
//
// Why no Framer Motion: a crossfade + a position dot doesn't justify the
// ~50kb gzip. Single useState + useEffect(setInterval). ~one client island.

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

type Props = {
  items: Project[];
  intervalMs?: number;
  className?: string;
  accentDot?: boolean;            // signal-yellow active-dot (desktop only)
  fillHeight?: boolean;           // h-full when used in the desktop stage panel
};

export default function ProjectStage({
  items,
  intervalMs = 4000,
  className,
  accentDot = false,
  fillHeight = false,
}: Props) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onChange = () => {
      reducedMotionRef.current = mq.matches;
    };
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    if (paused || reducedMotionRef.current || items.length <= 1) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [paused, intervalMs, items.length]);

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden border border-charcoal bg-bone",
        fillHeight ? "h-full" : "aspect-[16/10]",
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused((p) => !p)}
      aria-roledescription="carousel"
      aria-label="project gallery"
    >
      {items.map((p, i) => {
        const isActive = i === active;
        const hasVideo = !!p.video;
        return (
          <div
            key={p.slug}
            className={cn(
              "absolute inset-0 transition-opacity ease-snap",
              isActive ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
            style={{ transitionDuration: "800ms" }}
            aria-hidden={!isActive}
          >
            {hasVideo ? (
              <video
                src={p.video}
                poster={p.image}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <img
                src={p.image}
                alt={p.title}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            {/* hairline gradient at bottom to hold the project title */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-charcoal/70 to-transparent pointer-events-none" />
          </div>
        );
      })}

      {/* counter */}
      <div className="absolute top-3 right-3 z-20 font-mono uppercase tracking-label text-[0.7rem] text-bone bg-charcoal/70 px-2 py-1">
        {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
      </div>

      {/* title + blurb */}
      <div className="absolute inset-x-0 bottom-0 z-20 px-5 pb-4 md:px-7 md:pb-6 text-bone">
        <p className="font-mono uppercase tracking-label text-[0.7rem] opacity-80">
          // {items[active].slug} — {items[active].status}
        </p>
        <p className="font-display text-2xl md:text-3xl leading-tight tracking-[-0.015em] mt-2">
          {items[active].title}
        </p>
        <p className="font-mono text-[0.75rem] mt-2 opacity-80 max-w-md line-clamp-2">
          {items[active].blurb}
        </p>
      </div>

      {/* dot row */}
      {items.length > 1 && (
        <div className="absolute bottom-3 right-3 z-20 flex gap-1.5">
          {items.map((p, i) => {
            const isActive = i === active;
            return (
              <button
                key={p.slug}
                type="button"
                aria-label={`Show ${p.title}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                className={cn(
                  "block h-1.5 w-1.5 transition-colors duration-snap ease-snap",
                  isActive
                    ? accentDot
                      ? // signal only at lg+ to honor the "one yellow per
                        // viewport" rule alongside the live badge / accent card
                        "bg-bone lg:bg-signal"
                      : "bg-bone"
                    : "bg-bone/30 hover:bg-bone/60"
                )}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
