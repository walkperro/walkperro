export default function Stars({ value }: { value: number }) {
  return (
    <div className="text-emerald">
      {"★★★★★".slice(0, value)}
      <span className="text-silver/40">{"★★★★★".slice(value)}</span>
    </div>
  );
}
