import Image from "next/image";
import Link from "next/link";
import type { PortfolioEntry } from "@/data/portfolio-manifest";

interface Props {
  entry: PortfolioEntry;
  lqip?: { desktop?: string; mobile?: string };
  /** When true, image loads eagerly. */
  priority?: boolean;
  /** Visual size of the card — "lead" cards span larger. */
  size?: "lead" | "standard";
}

export function PortfolioCard({
  entry,
  lqip,
  priority = false,
  size = "standard",
}: Props) {
  const imgSrc = entry.generatedAsset
    ? `/brand/${entry.slug === "ict-bot" ? "ict-bot-1600" : entry.slug + "-1600"}.webp`
    : `/portfolio/${entry.slug}-desktop.webp`;

  const heightClass =
    size === "lead"
      ? "aspect-[16/10] md:aspect-[16/9]"
      : "aspect-[4/3] md:aspect-[3/2]";

  const Inner = (
    <article className="group relative lift">
      <div
        className={`relative ${heightClass} overflow-hidden bg-[color:var(--border)] border border-[color:var(--border)]`}
      >
        <Image
          src={imgSrc}
          alt={`${entry.title} — ${entry.category}`}
          fill
          sizes={size === "lead" ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          placeholder={lqip?.desktop ? "blur" : "empty"}
          blurDataURL={lqip?.desktop}
          className="img-zoom object-cover"
        />
      </div>
      <header className="mt-4 flex items-start justify-between gap-6">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--muted)]">
            {entry.category}
          </p>
          <h3
            className={`mt-2 t-display ${
              size === "lead"
                ? "text-[clamp(1.75rem,3.4vw,2.5rem)]"
                : "text-[clamp(1.4rem,2.4vw,1.875rem)]"
            } leading-[1.05]`}
          >
            {entry.title}
          </h3>
        </div>
        <span className="font-mono text-xs text-[color:var(--muted)] shrink-0 mt-2">
          {entry.year}
        </span>
      </header>
      <p className="mt-3 text-sm md:text-base text-[color:var(--fg)]/80 max-w-prose leading-relaxed">
        {entry.blurb}
      </p>
      <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--muted)]">
        {entry.stack.map((s, i) => (
          <li key={s} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden className="text-[color:var(--border)]">·</span>}
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </article>
  );

  if (entry.url) {
    return (
      <Link
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        aria-label={`Visit ${entry.title}`}
      >
        {Inner}
      </Link>
    );
  }
  return Inner;
}
