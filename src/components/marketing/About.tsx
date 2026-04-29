import { copy } from "@/data/copy";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";

export function About() {
  return (
    <section
      id="studio"
      className="px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-[color:var(--border)]"
      aria-label="About the studio"
    >
      <div className="max-w-[80rem] mx-auto grid grid-cols-12 gap-6 md:gap-10">
        <div className="col-span-12 md:col-span-3">
          <RevealOnScroll>
            <p className="t-eyebrow">{copy.about.eyebrow}</p>
          </RevealOnScroll>
        </div>
        <div className="col-span-12 md:col-span-9 md:border-l md:border-[color:var(--border)] md:pl-10">
          <RevealOnScroll>
            <h2 className="t-display text-[clamp(2rem,5.5vw,4rem)] leading-[1.02] max-w-3xl">
              {copy.about.headline}
            </h2>
          </RevealOnScroll>
          <div className="mt-12 md:mt-16 grid gap-6 md:gap-8 max-w-prose text-base md:text-lg leading-relaxed text-[color:var(--fg)]/85">
            {copy.about.body.map((para, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <p>{para}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
