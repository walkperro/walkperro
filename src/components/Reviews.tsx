"use client"
import { reviews as source } from "@/data/reviews"
import type { Review } from "@/types/review"
import Stars from "./Stars"

export default function Reviews({ slug }: { slug: keyof typeof source | string }) {
  const items: Review[] = (source as any)[slug] ?? []
  const count = items.length
  const avg = count ? items.reduce((s, r) => s + r.rating, 0) / count : 0

  return (
    <section className="mt-14 border-t pt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Reviews</h2>
        <div className="flex items-center gap-2 text-sm text-zinc-600">
          <Stars value={avg} />
          <span>{avg ? avg.toFixed(1) : "0.0"} · {count} {count === 1 ? "review" : "reviews"}</span>
        </div>
      </div>

      {count === 0 ? (
        <p className="mt-4 text-zinc-600">No reviews yet. Be the first to share your results.</p>
      ) : (
        <ul className="mt-6 space-y-6">
          {items.map(r => (
            <li key={r.id} className="rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <div className="font-medium">
                  {r.name}{r.verified && <span className="ml-2 inline-block rounded bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700">Verified</span>}
                </div>
                <Stars value={r.rating} />
              </div>
              <p className="mt-2 text-sm text-zinc-700">{r.comment}</p>
              <p className="mt-1 text-xs text-zinc-400">{new Date(r.date).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
