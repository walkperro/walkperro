import Button from "@/components/Button";

// Services list — 6 items, 1-col mobile / 2-col desktop, hairline-divided.
// Single "request a quote" ghost button at the end. No prices visible — every
// job priced per-context (see plan: walkperro homepage v2, section E).

const SERVICES: { name: string; descriptor: string }[] = [
  { name: "websites", descriptor: "full-stack next.js, ships in a week" },
  { name: "ad creative", descriptor: "short-form video + photo for paid social" },
  { name: "seo", descriptor: "sitemaps, schema, indexing, content" },
  { name: "trading bots", descriptor: "strategy → backtest → live runner" },
  { name: "brochures", descriptor: "pdf + print, brand-locked" },
  { name: "ai workflows", descriptor: "claude + supabase + stripe wired end-to-end" },
];

export default function ServicesGrid() {
  return (
    <>
      <ul className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-12">
        {SERVICES.map((s, i) => (
          <li
            key={s.name}
            className="py-5 flex items-baseline gap-4 border-t border-line first:border-t-0 md:[&:nth-child(2)]:border-t-0"
          >
            <span className="label shrink-0">{String(i + 1).padStart(2, "0")}</span>
            <div className="flex flex-col gap-1">
              <span className="font-display text-xl">{s.name}</span>
              <span className="font-mono text-[0.8125rem] text-charcoal/70">
                {s.descriptor}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10">
        <Button
          href="mailto:walkperro@proton.me?subject=quote"
          external
          variant="ghost"
        >
          REQUEST A QUOTE →
        </Button>
      </div>
    </>
  );
}
