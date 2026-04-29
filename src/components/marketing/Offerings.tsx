import { offerings } from "@/data/offerings";
import { copy } from "@/data/copy";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";

export function Offerings() {
  return (
    <section
      id="services"
      className="px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-[color:var(--border)]"
      aria-label="What we do"
    >
      <div className="max-w-[80rem] mx-auto">
        <RevealOnScroll>
          <header className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
            <p className="t-eyebrow col-span-12 md:col-span-3">{copy.offerings.eyebrow}</p>
            <h2 className="t-display text-[clamp(2rem,6vw,4.5rem)] col-span-12 md:col-span-9">
              {copy.offerings.intro}
            </h2>
          </header>
        </RevealOnScroll>

        <div className="divide-y divide-[color:var(--border)]">
          {offerings.map((item, idx) => (
            <RevealOnScroll key={item.number} delay={idx * 80} as="article">
              <div className="grid grid-cols-12 gap-6 md:gap-10 py-12 md:py-16 group">
                {/* Left: number + title — 5 cols */}
                <div className="col-span-12 md:col-span-5">
                  <div className="flex items-baseline gap-4">
                    <span className="font-mono text-xs text-[color:var(--accent)] tracking-wider">
                      {item.number}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                      service
                    </span>
                  </div>
                  <h3 className="mt-3 t-display text-[clamp(1.6rem,3.4vw,2.4rem)] leading-[1.05] max-w-md">
                    {item.title}
                  </h3>
                </div>

                {/* Right: prose + tags — 7 cols */}
                <div className="col-span-12 md:col-span-7 md:pl-8 md:border-l md:border-[color:var(--border)]">
                  <p className="text-base md:text-lg leading-relaxed text-[color:var(--fg)]/85 max-w-prose">
                    {item.body}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
                    {item.tags.map((tag, i) => (
                      <li key={tag} className="flex items-center gap-3">
                        {i > 0 && <span aria-hidden className="text-[color:var(--border)]">·</span>}
                        <span>{tag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
