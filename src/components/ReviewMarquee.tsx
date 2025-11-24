"use client";

import { reviews } from "@/lib/reviews";
import StarsMini from "./StarsMini";

/**
 * Seamless marquee: we duplicate the chip list once and translate -50%.
 * That makes the end meet the start with no visible jump.
 * Tune speed with --dur (e.g., 8s–14s).
 */
export default function ReviewMarquee() {
  const chips = reviews.map((r, i) => (
    <li
      key={`${r.author}-${i}`}
      className="shrink-0 rounded-full bg-white/90 ring-1 ring-slate-200 px-4 py-2 flex items-center gap-2 text-[13px] text-slate-700 shadow-sm"
    >
      <span className="font-medium text-slate-800">{r.author}</span>
      <span className="text-slate-300">·</span>
      <StarsMini value={r.rating} />
      <span className="text-slate-300">·</span>
      <span className="italic text-slate-600">“{r.headline}”</span>
    </li>
  ));

  return (
    <div
      className="relative overflow-hidden"
      style={{
        WebkitMaskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        maskImage:
          "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div
        className="flex gap-3 will-change-transform marquee-track"
        style={{ ["--dur" as any]: "107s" }} /* speed control */
      >
        <ul className="flex gap-3">{chips}</ul>
        {/* duplicate once for seamless loop */}
        <ul className="flex gap-3" aria-hidden>{chips}</ul>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .marquee-track {
          width: max-content;
          animation: marquee var(--dur) linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
