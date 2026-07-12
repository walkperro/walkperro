import Link from "next/link";
import { getAllGuides } from "@/lib/guides";

// Homepage strip linking the free guides + the course-making service.
// Server component (reads the guides list from the filesystem).

export default function GuidesTease() {
  const guides = getAllGuides().slice(0, 3);
  if (guides.length === 0) return null;

  return (
    <section data-reveal id="guides" className="py-20 border-t border-line">
      <div className="flex items-baseline justify-between gap-6">
        <p className="label">// FREE GUIDES — READ BEFORE YOU BUY ANYTHING</p>
        <Link href="/guides" className="label hover:text-charcoal shrink-0">
          ALL GUIDES →
        </Link>
      </div>
      <div className="hairline mt-3" />
      <ul className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-px bg-line border border-line">
        {guides.map((g) => (
          <li key={g.slug} className="bg-bone">
            <Link
              href={`/guides/${g.slug}`}
              className="group flex h-full flex-col gap-3 p-6 transition-colors duration-snap ease-snap hover:bg-line/40"
            >
              <p className="label">// {g.readMinutes} MIN</p>
              <p className="font-display text-xl leading-snug">{g.title}</p>
              <p className="text-charcoal/75 text-sm leading-relaxed">{g.excerpt}</p>
              <p className="label mt-auto pt-2 group-hover:text-charcoal">READ →</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
