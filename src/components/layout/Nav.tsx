import Link from "next/link";
import { copy } from "@/data/copy";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[color:var(--bg)]/80 border-b border-[color:var(--border)]">
      <nav className="mx-auto max-w-[80rem] px-6 md:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          aria-label={copy.brand.name}
          className="font-display text-xl tracking-tight"
        >
          {copy.brand.name}
        </Link>

        <ul className="hidden md:flex items-center gap-8 text-sm">
          {copy.nav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-[color:var(--muted)] hover:text-[color:var(--fg)] transition-colors duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={`mailto:${copy.contact.mailto}?subject=${encodeURIComponent(copy.contact.subject)}`}
          className="hidden md:inline-flex items-center gap-2 text-sm font-mono lowercase tracking-wide text-[color:var(--fg)] hover:text-[color:var(--accent)] transition-colors duration-200"
        >
          <span aria-hidden className="block w-1 h-1 rounded-full bg-[color:var(--accent)]" />
          {copy.contact.cta.toLowerCase()}
        </Link>

        <Link
          href={`mailto:${copy.contact.mailto}?subject=${encodeURIComponent(copy.contact.subject)}`}
          className="md:hidden text-sm font-mono lowercase text-[color:var(--accent)]"
        >
          contact
        </Link>
      </nav>
    </header>
  );
}
