"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Item = {
  slug?: string;
  name: string;
  coverImage: string | null;
  price?: string;
  url?: string; // buy link
  bullets?: string[]; // details
};
type Props = { items: Item[]; className?: string };

export default function Carousel3D({ items, className }: Props) {
  const [index, setIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const shellRef = useRef<HTMLDivElement | null>(null);
  const [dims, setDims] = useState({ w: 360, h: 500, isMobile: false });

  useEffect(() => {
    const el = shellRef.current;
    if (!el) return;

    const measure = () => {
      const W = el.clientWidth;
      const isMobile = window.innerWidth < 768;
      const base =
        W < 440
          ? Math.min(320, Math.max(260, Math.floor(W * 0.82)))
          : W < 1024
            ? Math.min(380, Math.max(300, Math.floor(W * 0.62)))
            : Math.min(420, Math.max(320, Math.floor(W * 0.48)));
      const H = Math.round(base * 1.38);
      setDims({ w: base, h: H, isMobile });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const SPACING = useMemo(
    () =>
      dims.isMobile ? Math.round(dims.w * 0.65) : Math.round(dims.w * 0.72),
    [dims.w, dims.isMobile],
  );
  const DEPTH = useMemo(() => (dims.isMobile ? 200 : 260), [dims.isMobile]);
  const TILT = 50;

  const go = (dir: -1 | 1) => {
    setFlippedIndex(null);
    setIndex((i) => (i + dir + items.length) % items.length);
  };

  return (
    <div
      ref={shellRef}
      className={`relative mx-auto w-full max-w-6xl ${className ?? ""}`}
      style={{
        height: dims.h + 120,
        perspective: 1400,
        perspectiveOrigin: "50% 18%",
        overflow: "visible",
        marginTop: "clamp(8px, 1.5vh, 16px)",
      }}
    >
      {/* edge fades */}
      <div
        className="pointer-events-none absolute inset-x-0"
        style={{
          top: dims.h / 2,
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

      {/* stage */}
      <div
        className="absolute inset-x-0"
        style={{
          top: 0,
          height: dims.h,
          pointerEvents: "none",
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, i) => {
          const rel = i - index;
          const half = Math.floor(items.length / 2);
          const shortest =
            rel > half
              ? rel - items.length
              : rel < -half
                ? rel + items.length
                : rel;

          const dist = Math.abs(shortest);
          const x = shortest * SPACING;
          const angle = -Math.max(
            -TILT,
            Math.min(TILT, shortest * (TILT * 0.9)),
          );
          const z = -dist * DEPTH;
          const scale = Math.max(0.86, 1 - dist * 0.06);
          const opacity = Math.max(0.55, 1 - dist * 0.18);

          const isActive = i === index;
          const isFlipped = flippedIndex === i;

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
                zIndex: 100 - dist,
                opacity,
                pointerEvents: dist <= 1 ? "auto" : "none",
              }}
            >
              {/* Flip container */}
              <div
                className="relative h-full w-full [transform-style:preserve-3d] rounded-[28px]"
                style={{
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  transition: "transform 480ms cubic-bezier(.22,.61,.36,1)",
                }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 rounded-[28px] overflow-hidden [backface-visibility:hidden]"
                  style={{
                    background: "white",
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
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
                      Cover coming soon
                    </div>
                  )}

                  {/* front-only invisible click layer to flip */}
                  {isActive && !isFlipped && (
                    <button
                      type="button"
                      aria-label="View details"
                      onClick={() => setFlippedIndex(i)}
                      className="absolute inset-0"
                      style={{ background: "transparent" }}
                    />
                  )}
                </div>

                {/* BACK (interactive) */}
                <div
                  className="absolute inset-0 rounded-[28px] [backface-visibility:hidden] overflow-hidden"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div className="h-full w-full bg-white/95 backdrop-blur p-6 flex flex-col">
                    <h3 className="text-2xl font-semibold text-slate-900">
                      {item.name}
                    </h3>

                    <div className="mt-3 flex-1 overflow-y-auto pr-1">
                      {item.bullets?.length ? (
                        <ul className="space-y-2 text-slate-700 text-sm list-disc list-inside">
                          {item.bullets.slice(0, 6).map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-slate-600 text-sm">
                          Instant access digital download.
                        </p>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-lg font-semibold text-slate-900">
                        {item.price ?? ""}
                      </span>
                      {item.url ? (
                        <a
                          href={item.url}
                          className="inline-flex items-center rounded-full px-4 py-2 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
                        >
                          Buy now
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* back face gets its own small hotspot to flip back (bottom-center) */}
                  {isActive && isFlipped && (
                    <button
                      type="button"
                      aria-label="View cover"
                      onClick={() => setFlippedIndex(null)}
                      className="absolute left-1/2 -translate-x-1/2 bottom-3 text-sm font-medium underline underline-offset-4 text-slate-700 hover:text-slate-900"
                    >
                      View cover
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper text button under the card */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ top: Math.max(dims.h - 36, 12) }}
      >
        <button
          type="button"
          onClick={() => setFlippedIndex(flippedIndex === index ? null : index)}
          className="text-sm font-medium underline underline-offset-4 text-slate-700 hover:text-slate-900"
        >
          {flippedIndex === index ? "View cover" : "View details"}
        </button>
      </div>

      {/* Arrows */}
      <div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex gap-3"
        style={{ top: dims.h + 16 }}
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
