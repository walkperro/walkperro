"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  name: string;
  coverImage: string | null;
  price?: string;
};

type Props = {
  items: Item[];
  className?: string;
};

export default function Carousel3D({ items, className }: Props) {
  const [index, setIndex] = useState(0);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ w: 360, h: 500, isMobile: false });

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const measure = () => {
      const W = el.clientWidth;
      const isMobile = window.innerWidth < 768;
      const base =
        W < 440 ? Math.min(320, Math.max(260, Math.floor(W * 0.82))) :
        W < 1024 ? Math.min(380, Math.max(300, Math.floor(W * 0.62))) :
        Math.min(420, Math.max(320, Math.floor(W * 0.48)));
      const H = Math.round(base * 1.38);
      setDims({ w: base, h: H, isMobile });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    window.addEventListener("resize", measure);
    return () => { ro.disconnect(); window.removeEventListener("resize", measure); };
  }, []);

  const SPACING = useMemo(
    () => (dims.isMobile ? Math.round(dims.w * 0.65) : Math.round(dims.w * 0.72)),
    [dims.w, dims.isMobile]
  );

  // Depth controls how far side slides recede
  const DEPTH = useMemo(() => (dims.isMobile ? 200 : 260), [dims.isMobile]);
  const TILT  = 50; // max rotateY angle

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + items.length) % items.length);

  return (
    <div
      ref={shellRef}
      className={`relative mx-auto w-full max-w-6xl ${className ?? ""}`}
      style={{
        height: "62dvh",
        perspective: 1400,
        perspectiveOrigin: "50% 18%",
        overflow: "visible",
      }}
    >
      {/* edge fade masks */}
      <div
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: "calc(50% - 2px)",
          height: dims.h + 4,
          transform: "translateY(-50%)",
        }}
      >
        <div
          className="absolute inset-y-0 left-0 w-[22%]"
          style={{ maskImage: "linear-gradient(to right, black, transparent)" }}
        />
        <div
          className="absolute inset-y-0 right-0 w-[22%]"
          style={{ maskImage: "linear-gradient(to left, black, transparent)" }}
        />
      </div>

      {/* card stage */}
      <div
        className="absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{ height: dims.h, pointerEvents: "none", transformStyle: "preserve-3d" }}
      >
        {items.map((item, i) => {
          // wrap-around shortest distance from current index
          const rel = i - index;
          const half = Math.floor(items.length / 2);
          const shortest = rel > half ? rel - items.length : rel < -half ? rel + items.length : rel;

          const dist = Math.abs(shortest);
          const x = shortest * SPACING;

          // rotation & depth
          const angle = -Math.max(-TILT, Math.min(TILT, shortest * (TILT * 0.9)));
          const z = -dist * DEPTH;

          // subtle scale & fade on sides
          const scale = Math.max(0.86, 1 - dist * 0.06);
          const opacity = Math.max(0.55, 1 - dist * 0.18);

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 will-change-transform"
              style={{
                width: dims.w,
                height: dims.h,
                transform: `
                  translate(-50%,-50%)
                  rotateY(${angle}deg)
                  translateZ(${z}px)
                  translateX(${x}px)
                  scale(${scale})
                `,
                transition: "transform 520ms cubic-bezier(.22,.61,.36,1)",
                transformStyle: "preserve-3d",
                zIndex: 100 - dist, // center on top
                opacity,
                pointerEvents: dist <= 1 ? "auto" : "none",
              }}
            >
              <div
                className="rounded-[28px] overflow-hidden"
                style={{
                  background: "white",
                  backfaceVisibility: "hidden",
                  boxShadow:
                    dist === 0
                      ? "0 22px 44px rgba(2,6,23,0.18)"
                      : "0 14px 30px rgba(2,6,23,0.12)",
                }}
              >
                {item.coverImage ? (
                  <img
                    src={item.coverImage}
                    alt={item.name}
                    width={dims.w}
                    height={dims.h}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
                    Cover coming soon
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* controls */}
      <div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex gap-3"
        style={{ bottom: "clamp(10px,3dvh,40px)" }}
      >
        <button
          aria-label="Previous"
          onClick={() => go(-1)}
          className="h-10 w-10 rounded-full bg-slate-900 text-white grid place-items-center shadow-md active:scale-95"
        >
          ‹
        </button>
        <button
          aria-label="Next"
          onClick={() => go(1)}
          className="h-10 w-10 rounded-full bg-slate-900 text-white grid place-items-center shadow-md active:scale-95"
        >
          ›
        </button>
      </div>
    </div>
  );
}
