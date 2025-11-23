"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import CheckoutButton from "@/components/CheckoutButton";

type Item = {
  slug: string;
  name: string;
  eyebrow: string;
  price: string;
  coverImage: string | null;
  payhipUrl: string;
  payhipProductId: string;
  bullets: string[];
  footerLine?: string;
};

type Props = { items: Item[]; className?: string };

export default function Carousel3D({ items, className }: Props) {
  const [index, setIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
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

  // reset the back face when you change card
  useEffect(() => { setShowBack(false); }, [index]);

  const SPACING = useMemo(
    () => (dims.isMobile ? Math.round(dims.w * 0.65) : Math.round(dims.w * 0.72)),
    [dims.w, dims.isMobile]
  );
  const DEPTH = useMemo(() => (dims.isMobile ? 200 : 260), [dims.isMobile]);
  const TILT = 50;

  const go = (dir: -1 | 1) => setIndex((i) => (i + dir + items.length) % items.length);

  return (
    <div
      ref={shellRef}
      className={`relative mx-auto w-full max-w-6xl ${className ?? ""}`}
      style={{
        height: dims.h + 128,                 // space for “view” + arrows
        perspective: 1400,
        perspectiveOrigin: "50% 18%",
        overflow: "visible",
        marginTop: "clamp(8px, 1.5vh, 16px)",
      }}
    >
      {/* stage */}
      <div
        className="absolute inset-x-0"
        style={{ top: 0, height: dims.h, transformStyle: "preserve-3d", pointerEvents: "none" }}
      >
        {items.map((item, i) => {
          const rel = i - index;
          const half = Math.floor(items.length / 2);
          const shortest =
            rel > half ? rel - items.length : rel < -half ? rel + items.length : rel;

          const dist = Math.abs(shortest);
          const x = shortest * SPACING;
          const angle = -Math.max(-TILT, Math.min(TILT, shortest * (TILT * 0.9)));
          const z = -dist * DEPTH;
          const scale = Math.max(0.86, 1 - dist * 0.06);
          const opacity = Math.max(0.55, 1 - dist * 0.18);

          const isCenter = dist === 0;

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
                pointerEvents: isCenter ? "auto" : "none",
              }}
            >
              {/* Card wrapper that flips only for the centered item */}
              <div
                className="relative h-full w-full"
                style={{
                  transformStyle: "preserve-3d",
                  transition: isCenter ? "transform 420ms ease" : undefined,
                  transform: isCenter && showBack ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 rounded-[28px] overflow-hidden"
                  style={{
                    background: "white",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    boxShadow: isCenter
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
                        willChange: "transform",
                      }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
                      Cover coming soon
                    </div>
                  )}
                </div>

                {/* BACK (details) */}
                <div
                  className="absolute inset-0 rounded-[28px] overflow-hidden"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    background:
                      "radial-gradient(120% 120% at 30% 0%, rgba(15,23,42,.08), rgba(2,6,23,.06))",
                    border: "1px solid rgba(2,6,23,.08)",
                  }}
                >
                  <div className="flex h-full w-full flex-col p-5 sm:p-6">
                    <p className="text-[0.72rem] tracking-[0.28em] uppercase text-slate-500">
                      {item.eyebrow}
                    </p>
                    <h3 className="mt-1 text-xl font-semibold text-slate-900">{item.name}</h3>
                    <p className="mt-1 text-slate-700">{item.price}</p>

                    <ul className="mt-4 space-y-2 text-[0.95rem] text-slate-700">
                      {item.bullets.map((b) => (
                        <li key={b} className="flex gap-2">
                          <span className="mt-[0.5rem] h-[3px] w-[3px] rounded-full bg-emerald-600/80" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>

                    {item.footerLine && (
                      <p className="mt-4 text-[0.9rem] text-slate-600">{item.footerLine}</p>
                    )}

                    <p className="mt-4 text-[0.72rem] uppercase tracking-[0.20em] text-slate-400">
                      Paypal + Card checkout via Payhip · instant download
                    </p>

                    <div className="mt-auto pt-4">
                      <CheckoutButton
                        payhipCode={item.payhipProductId}
                        slug={item.slug}
                        title={item.name}
                        price={parseFloat(item.price.replace(/[^0-9.]/g, ""))}
                      >
                        {`Get ${item.name.replace(/ Toolkit| Bundle| Hacks| Guide/i, "").trim()} →`}
                      </CheckoutButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* view toggle below card */}
      <div className="absolute left-1/2 -translate-x-1/2" style={{ top: dims.h + 16 }}>
        <button
          onClick={() => setShowBack((s) => !s)}
          className="rounded-full bg-slate-900 text-white px-6 py-3 text-sm font-semibold tracking-[0.12em] shadow-md active:scale-95"
        >
          {showBack ? "VIEW COVER" : "VIEW DETAILS"}
        </button>
      </div>

      {/* arrows under that */}
      <div
        className="pointer-events-auto absolute left-1/2 -translate-x-1/2 flex gap-3"
        style={{ top: dims.h + 16 + 56 }}
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
