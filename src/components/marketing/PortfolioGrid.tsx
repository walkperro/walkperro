import { portfolio } from "@/data/portfolio-manifest";
import { copy } from "@/data/copy";
import { PortfolioCard } from "./PortfolioCard";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";
import lqipMap from "@/data/portfolio-lqip.json";

export function PortfolioGrid() {
  const sorted = [...portfolio].sort((a, b) => a.rank - b.rank);
  const [lead, ...rest] = sorted;
  const map = lqipMap as Record<string, { desktop?: string; mobile?: string }>;

  return (
    <section
      id="work"
      className="px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-[color:var(--border)]"
      aria-label="Selected work"
    >
      <div className="max-w-[80rem] mx-auto">
        <RevealOnScroll>
          <header className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
            <p className="t-eyebrow col-span-12 md:col-span-3">{copy.portfolio.eyebrow}</p>
            <h2 className="t-display text-[clamp(2rem,6vw,4.5rem)] col-span-12 md:col-span-9">
              {copy.portfolio.intro}
            </h2>
          </header>
        </RevealOnScroll>

        {/* Lead piece — full-bleed, ranked #1 */}
        <RevealOnScroll>
          <div className="mb-16 md:mb-24">
            <PortfolioCard
              entry={lead}
              lqip={map[lead.slug]}
              priority
              size="lead"
            />
          </div>
        </RevealOnScroll>

        {/* Remaining 6 — asymmetric 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16 md:gap-y-24">
          {rest.map((entry, idx) => (
            <RevealOnScroll key={entry.slug} delay={idx * 60}>
              <PortfolioCard
                entry={entry}
                lqip={map[entry.slug]}
                size="standard"
                priority={idx < 1}
              />
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
