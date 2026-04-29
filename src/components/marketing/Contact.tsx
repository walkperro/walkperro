import Link from "next/link";
import { copy } from "@/data/copy";
import { RevealOnScroll } from "@/components/primitives/RevealOnScroll";

export function Contact() {
  const href = `mailto:${copy.contact.mailto}?subject=${encodeURIComponent(
    copy.contact.subject,
  )}`;

  return (
    <section
      id="contact"
      className="px-6 md:px-12 lg:px-20 py-24 md:py-32 border-t border-[color:var(--border)]"
      aria-label="Contact"
    >
      <div className="max-w-[80rem] mx-auto grid grid-cols-12 gap-6 md:gap-10 items-end">
        <div className="col-span-12 md:col-span-7">
          <RevealOnScroll>
            <p className="t-eyebrow">{copy.contact.eyebrow}</p>
            <h2 className="mt-6 t-display text-[clamp(2.5rem,8vw,6rem)] leading-[0.96]">
              {copy.contact.headline}
            </h2>
            <p className="mt-8 max-w-md text-base md:text-lg text-[color:var(--muted)]">
              {copy.contact.sub}
            </p>
          </RevealOnScroll>
        </div>

        <div className="col-span-12 md:col-span-5 md:flex md:justify-end">
          <RevealOnScroll delay={140}>
            <Link
              href={href}
              className="group relative inline-flex items-center gap-4 px-8 py-5 border border-[color:var(--fg)] text-[color:var(--fg)] hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)] transition-colors duration-200"
            >
              <span className="font-mono text-sm uppercase tracking-[0.18em]">
                {copy.contact.cta}
              </span>
              <span
                aria-hidden
                className="block transition-transform duration-200 group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
