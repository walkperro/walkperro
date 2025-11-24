"use client";
import StarsMini from "./StarsMini";
import { reviews } from "@/lib/reviews";

type R = (typeof reviews)[number];

function ReviewPill({ r }: { r: R }) {
  return (
    <div className="shrink-0 mx-2 my-3 rounded-full bg-white/90 backdrop-blur px-4 py-2 shadow-sm ring-1 ring-slate-200/70 text-[13px] leading-none flex items-center gap-2">
      <span className="font-medium text-slate-800">{r.author}</span>
      <span className="text-slate-400">·</span>
      <StarsMini value={r.rating} />
      <span className="text-slate-500">“{r.headline}”</span>
    </div>
  );
}

export default function ReviewMarquee() {
  const list = [...reviews, ...reviews]; // duplicate for seamless loop
  return (
    <div className="relative mt-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-50 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-50 to-transparent" />
      <div className="overflow-hidden">
        <div className="flex animate-marquee will-change-transform">
          {list.map((r, i) => (
            <ReviewPill key={i} r={r} />
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
        .animate-marquee { animation: marquee 32s linear infinite; }
      `}</style>
    </div>
  );
}
