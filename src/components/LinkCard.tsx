import { cn } from "@/lib/utils";

// Big CTA card for the homepage linktree stack. ~88px tall on mobile, taller
// on desktop. Three modes:
//   • href + external → renders <a target="_blank">
//   • href (internal)  → renders <a> (next/link not needed; root anchors fine here)
//   • no href + children → renders a <div> wrapping the children (waitlist mode)
//
// `accent` paints the signal-yellow fill — at most ONE per viewport per the
// brand rule, so the parent page must coordinate which card carries it.

type LinkCardProps = {
  label: string;
  sublabel?: string;
  href?: string;
  external?: boolean;
  accent?: boolean;
  // When true, the signal-yellow fill applies only at `<lg`. Used to keep the
  // brand "one yellow per viewport" rule when desktop's ProjectStage already
  // carries an accent dot.
  accentMobileOnly?: boolean;
  children?: React.ReactNode;
  className?: string;
};

const base =
  "group block w-full text-left border transition-colors duration-snap ease-snap";

const filled =
  "bg-signal text-charcoal border-charcoal hover:bg-charcoal hover:text-bone";

const filledMobileOnly =
  "bg-signal text-charcoal border-charcoal hover:bg-charcoal hover:text-bone lg:bg-bone lg:text-charcoal lg:border-charcoal lg:hover:bg-charcoal lg:hover:text-bone";

const outline =
  "bg-bone text-charcoal border-charcoal hover:bg-charcoal hover:text-bone";

function Inner({
  label,
  sublabel,
  accent,
}: {
  label: string;
  sublabel?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 px-5 py-6 md:px-7 md:py-7 min-h-[88px]">
      <div className="flex flex-col gap-2 min-w-0">
        {sublabel && (
          <span
            className={cn(
              "font-mono uppercase tracking-label text-[0.7rem]",
              accent ? "text-charcoal/70" : "text-charcoal/60 group-hover:text-bone/60"
            )}
          >
            {sublabel}
          </span>
        )}
        <span className="font-display text-[clamp(1.25rem,4vw,1.875rem)] leading-tight tracking-[-0.015em]">
          {label}
        </span>
      </div>
      <span
        className={cn(
          "font-mono uppercase tracking-label text-[0.75rem] shrink-0 transition-transform duration-snap ease-snap",
          "group-hover:translate-x-1"
        )}
      >
        →
      </span>
    </div>
  );
}

export default function LinkCard({
  label,
  sublabel,
  href,
  external,
  accent,
  accentMobileOnly,
  children,
  className,
}: LinkCardProps) {
  const accentClass = accentMobileOnly ? filledMobileOnly : filled;
  const cls = cn(base, (accent || accentMobileOnly) ? accentClass : outline, className);

  if (children && !href) {
    return (
      <div className={cls}>
        <div className="flex items-center justify-between gap-6 px-5 pt-5 md:px-7">
          {sublabel && (
            <span className="font-mono uppercase tracking-label text-[0.7rem] text-charcoal/60">
              {sublabel}
            </span>
          )}
          <span className="font-mono uppercase tracking-label text-[0.7rem] text-charcoal/60">
            // waitlist
          </span>
        </div>
        <div className="px-5 pb-5 pt-3 md:px-7 md:pb-7">
          <p className="font-display text-[clamp(1.25rem,4vw,1.875rem)] leading-tight tracking-[-0.015em] mb-4">
            {label}
          </p>
          {children}
        </div>
      </div>
    );
  }

  if (href && external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
      >
        <Inner label={label} sublabel={sublabel} accent={accent} />
      </a>
    );
  }

  if (href) {
    return (
      <a href={href} className={cls}>
        <Inner label={label} sublabel={sublabel} accent={accent} />
      </a>
    );
  }

  return (
    <div className={cls}>
      <Inner label={label} sublabel={sublabel} accent={accent} />
    </div>
  );
}
