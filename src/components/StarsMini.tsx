export default function StarsMini({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, Math.round(value)));
  return (
    <span className="text-emerald text-sm leading-none">
      {"★★★★★".slice(0, v)}
      <span className="text-silver/40">{"★★★★★".slice(v)}</span>
    </span>
  );
}
