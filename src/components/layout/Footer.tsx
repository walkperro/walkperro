import Link from "next/link";
import { copy } from "@/data/copy";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      className="surface-invert px-6 md:px-12 lg:px-20 pt-24 pb-12 md:pt-32 md:pb-16 mt-0"
      aria-label="Footer"
    >
      <div className="max-w-[80rem] mx-auto">
        {/* Oxblood rule, single accent */}
        <div className="h-px w-32 bg-[color:var(--accent)]" />

        <div className="mt-12 md:mt-16 grid grid-cols-12 gap-6 md:gap-10">
          {/* Wordmark */}
          <div className="col-span-12 md:col-span-7">
            <p className="t-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.96]">
              {copy.brand.name}
            </p>
            <p className="mt-6 max-w-md text-base text-invert-muted text-[color:var(--invert-muted)]">
              {copy.footer.line}
            </p>
          </div>

          {/* Nav + contact */}
          <nav
            className="col-span-12 md:col-span-5 md:flex md:flex-col md:items-end md:justify-end"
            aria-label="Footer navigation"
          >
            <ul className="grid grid-cols-2 md:grid-cols-1 md:text-right gap-y-3 gap-x-8 font-mono text-sm">
              {copy.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[color:var(--invert-muted)] hover:text-[color:var(--invert-fg)] transition-colors duration-200"
                  >
                    {item.label.toLowerCase()}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={`mailto:${copy.contact.mailto}`}
                  className="text-[color:var(--invert-muted)] hover:text-[color:var(--invert-fg)] transition-colors duration-200"
                >
                  email
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-16 md:mt-24 pt-6 border-t border-[color:var(--invert-border)] flex flex-col md:flex-row gap-3 md:gap-0 md:items-center md:justify-between font-mono text-[11px] uppercase tracking-[0.16em] text-[color:var(--invert-muted)]">
          <span>© {year} {copy.brand.name}</span>
          <span>{copy.footer.rights}</span>
        </div>
      </div>
    </footer>
  );
}
