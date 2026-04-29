import { copy } from "@/data/copy";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-end px-6 md:px-12 lg:px-20 pt-32 md:pt-40 pb-16 md:pb-24"
      aria-label="Introduction"
    >
      {/* Eyebrow + meta — upper-right corner */}
      <div className="absolute top-20 md:top-28 right-6 md:right-12 lg:right-20 text-right">
        <p className="t-eyebrow">{copy.hero.eyebrow}</p>
      </div>

      {/* Headline — bottom-anchored, asymmetric */}
      <div className="max-w-[78rem]">
        <RevealOnScroll>
          <h1
            className="t-display text-[clamp(3.25rem,11vw,11rem)] leading-[0.92]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {copy.hero.headline}{" "}
            <span
              className="italic"
              style={{ color: "var(--accent)", fontFamily: "var(--font-display)" }}
            >
              {copy.hero.headlineEmphasis}
            </span>
          </h1>
        </RevealOnScroll>

        <RevealOnScroll delay={120}>
          <div className="mt-8 md:mt-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <p className="max-w-md text-base md:text-lg text-[color:var(--muted)] leading-relaxed">
              {copy.hero.sub}
            </p>
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.18em] text-[color:var(--muted)]">
              <span aria-hidden className="block w-8 h-px bg-[color:var(--accent)]" />
              <span>scroll</span>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
