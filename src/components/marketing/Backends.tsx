import Image from "next/image";
import { adminGallery } from "@/data/admin-gallery";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";

export function Backends() {
  return (
    <section
      id="backends"
      className="px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-[color:var(--border)]"
      aria-label="Behind the work"
    >
      <div className="max-w-[80rem] mx-auto">
        <RevealOnScroll>
          <header className="mb-16 md:mb-24 grid grid-cols-12 gap-6 items-end">
            <p className="t-eyebrow col-span-12 md:col-span-3">Behind the work</p>
            <div className="col-span-12 md:col-span-9">
              <h2 className="t-display text-[clamp(2rem,6vw,4.5rem)]">
                We build the <span className="italic" style={{ color: "var(--accent)" }}>backends</span> too.
              </h2>
              <p className="mt-6 max-w-2xl text-base md:text-lg text-[color:var(--muted)]">
                Real admin panels for real businesses — menu editors, order systems,
                email blasts, audit logs. Customer data has been redacted from every shot.
              </p>
            </div>
          </header>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10">
          {adminGallery.map((shot, idx) => {
            const span = shot.size === "wide" ? "md:col-span-12" : "md:col-span-6";
            return (
              <RevealOnScroll
                key={shot.src}
                delay={idx * 60}
                className={span}
              >
                <figure className="group lift">
                  <div className="relative aspect-[16/10] overflow-hidden bg-[color:var(--invert-bg)] border border-[color:var(--border)]">
                    <Image
                      src={`/portfolio/admin/${shot.src}.webp`}
                      alt={`${shot.project} admin — ${shot.feature}`}
                      fill
                      sizes={
                        shot.size === "wide"
                          ? "(min-width: 1024px) 80vw, 100vw"
                          : "(min-width: 1024px) 40vw, 100vw"
                      }
                      loading={idx < 1 ? "eager" : "lazy"}
                      className="img-zoom object-cover object-top"
                    />
                  </div>
                  <figcaption className="mt-4 flex items-start justify-between gap-6">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
                        {shot.project}
                      </p>
                      <h3 className="mt-2 t-display text-[clamp(1.25rem,2.2vw,1.75rem)] leading-tight">
                        {shot.feature}
                      </h3>
                      {shot.detail && (
                        <p className="mt-3 max-w-prose text-sm md:text-base text-[color:var(--fg)]/80 leading-relaxed">
                          {shot.detail}
                        </p>
                      )}
                    </div>
                  </figcaption>
                </figure>
              </RevealOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
