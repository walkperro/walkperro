"use client";

// The WebGL corridor island. Mounted only via next/dynamic ssr:false from
// ShowroomClient, and only on capable clients (WebGL present, no
// prefers-reduced-motion — checked upstream). Native scroll drives the
// camera; frameloop stays on "demand" and we invalidate() per scroll tick,
// so idle GPU cost is zero. PerformanceMonitor steps DPR down under load
// and bails out entirely (onIncapable) if the device can't hold frame.

import { Suspense, useRef, useState } from "react";
import Link from "next/link";
import { Canvas, invalidate } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import Scene from "@/components/showroom/Scene";
import { useTourScroll } from "@/components/showroom/useTourScroll";
import type { ShowroomItem } from "@/content/showroom";

const SECTION_VH_PER_ITEM = 34; // ~400vh total at 12 items

export default function ShowroomTour({
  items,
  onIncapable,
}: {
  items: ShowroomItem[];
  onIncapable: () => void;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [dpr, setDpr] = useState<number>(1.5);
  const declines = useRef(0);
  const { progressRef, focusIndex } = useTourScroll(
    sectionRef,
    items.length,
    invalidate
  );

  const focused = items[focusIndex];
  const sectionHeight = `${items.length * SECTION_VH_PER_ITEM}vh`;

  return (
    <div
      ref={sectionRef}
      className="relative -mx-6 lg:-mx-12"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-charcoal">
        <Canvas
          aria-hidden="true"
          frameloop="demand"
          dpr={[1, dpr]}
          gl={{ antialias: true, powerPreference: "low-power" }}
          camera={{ fov: 42, near: 0.1, far: 120, position: [0, 0, 4.2] }}
        >
          <PerformanceMonitor
            onDecline={() => {
              declines.current += 1;
              if (declines.current === 1) setDpr(1);
              else onIncapable();
            }}
          >
            <Suspense fallback={null}>
              <Scene
                items={items}
                progressRef={progressRef}
                focusIndex={focusIndex}
              />
            </Suspense>
          </PerformanceMonitor>
        </Canvas>

        {/* DOM overlay — synced to focus index. All CTAs are real anchors. */}
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between px-6 py-6 lg:px-12 lg:py-10">
          <div className="flex items-start justify-between">
            <p className="label !text-bone/70">// the showroom — scroll</p>
            <p className="font-mono uppercase tracking-label text-[0.75rem] text-bone bg-charcoal/70 px-2 py-1">
              {String(focusIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </p>
          </div>

          <div className="pointer-events-auto max-w-xl">
            <p className="label !text-bone/70">// {focused.category}</p>
            <p className="font-display text-3xl md:text-5xl leading-tight tracking-[-0.02em] text-bone mt-2">
              {focused.title}
            </p>
            <p className="font-mono text-[0.8125rem] text-bone/80 mt-3 max-w-md">
              {focused.tourLine}
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              {focused.demoUrl && (
                <a
                  href={focused.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label !text-bone border-b border-bone hover:!text-bone/70"
                >
                  {focused.demoKind === "demo"
                    ? "WALK THROUGH IT →"
                    : "VIEW LIVE →"}
                </a>
              )}
              <Link
                href={`/websites/${focused.inquireSlug || focused.slug}`}
                className="label !text-bone border-b border-bone hover:!text-bone/70"
              >
                GET THIS BUILT →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
