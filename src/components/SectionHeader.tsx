type SectionHeaderProps = {
  index?: string;
  label: string;
  title?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
};

export default function SectionHeader({
  index,
  label,
  title,
  meta,
  className = "",
}: SectionHeaderProps) {
  return (
    <header className={className}>
      <div className="flex items-baseline justify-between gap-6">
        <p className="label">
          {index ? `// ${index} — ${label}` : `// ${label}`}
        </p>
        {meta && <p className="label">{meta}</p>}
      </div>
      <div className="hairline mt-3" />
      {title && (
        <h2 className="font-display text-[clamp(1.75rem,4vw,2.5rem)] mt-5 max-w-3xl">
          {title}
        </h2>
      )}
    </header>
  );
}
