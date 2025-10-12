"use client";
import { useMemo } from "react";

type Review = { name: string; stars: number; text: string; date: string };

const SEED: Record<string, Review[]> = {
  "100-days": [
    { name: "Nadia P.", stars: 5, text: "Day 11 and I’ve hit $137/day twice. The daily target box keeps me honest.", date: "2025-09-18" },
    { name: "Marcus L.", stars: 5, text: "Exactly the structure I needed. Weekly review prompts are 🔥.", date: "2025-09-23" }
  ],
  "chatgpt-cash-hacks": [
    { name: "Devon R.", stars: 5, text: "Paste → tweak → sell. Closed 2 Fiverr gigs in 48 hours.", date: "2025-09-29" }
  ],
  "wealth-hacks": [
    { name: "Kaya M.", stars: 5, text: "FACE framework finally clicked. Content plan = zero guesswork.", date: "2025-09-30" }
  ],
  "money-moves": [
    { name: "Iris B.", stars: 5, text: "Printed two marketplace flyers and sold my first flip same day.", date: "2025-10-01" }
  ],
  "bundle": [
    { name: "Rafael G.", stars: 5, text: "All-in-one is worth it. Systems + prompts + trackers = momentum.", date: "2025-10-02" }
  ],
};

function Stars({ count }: { count: number }) {
  return (
    <span aria-label={`${count} out of 5 stars`} className="text-yellow-500 select-none">
      {"★★★★★".slice(0, count)}{"☆☆☆☆☆".slice(count)}
    </span>
  );
}

export default function Reviews({ slug }: { slug: keyof typeof SEED }) {
  const reviews = useMemo(() => SEED[slug] ?? [], [slug]);
  if (!reviews.length) return null;

  return (
    <section aria-labelledby="reviews-heading" className="mt-12 border-t pt-8">
      <h2 id="reviews-heading" className="text-xl font-semibold">What buyers say</h2>
      <ul className="mt-4 space-y-6">
        {reviews.map((r, i) => (
          <li key={i} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{r.name}</div>
              <Stars count={r.stars} />
            </div>
            <p className="mt-2 text-zinc-700">{r.text}</p>
            <p className="mt-1 text-xs text-zinc-500">{new Date(r.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
