import Link from "next/link";
import type { ShowroomItem } from "@/content/showroom";
import { cn } from "@/lib/utils";

// Server-rendered catalog grid — the crawlable, always-in-DOM view of the
// showroom. On clients where the WebGL corridor mounts, this collapses under
// a "browse as a list" toggle (handled by ShowroomSection) but is never
// removed from the DOM, so SEO and accessibility never depend on the canvas.

type Props = {
  items: ShowroomItem[];
  className?: string;
};

export default function ShowroomGrid({ items, className }: Props) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line",
        className
      )}
    >
      {items.map((item, i) => (
        <li key={item.slug} className="bg-bone">
          <div className="group flex h-full flex-col">
            <div className="relative aspect-[16/10] overflow-hidden bg-line">
              <img
                src={item.image}
                alt={`${item.title} — ${item.category}`}
                loading={i < 3 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-snap ease-snap group-hover:scale-[1.02]"
              />
              <div className="absolute top-3 left-3 font-mono uppercase tracking-label text-[0.7rem] bg-bone/95 text-charcoal px-2 py-1 border border-charcoal">
                {item.category}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-2 border-t border-line px-5 py-5">
              <p className="font-display text-2xl leading-tight">{item.title}</p>
              <p className="text-charcoal/80 leading-snug">{item.tourLine}</p>
              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-1 pt-3">
                {item.demoUrl && (
                  <a
                    href={item.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="label border-b border-charcoal hover:text-charcoal/70"
                  >
                    {item.demoKind === "demo" ? "WALK THROUGH IT →" : "VIEW LIVE →"}
                  </a>
                )}
                <Link
                  href={`/websites/${item.inquireSlug || item.slug}`}
                  className="label border-b border-charcoal hover:text-charcoal/70"
                >
                  GET THIS BUILT →
                </Link>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
