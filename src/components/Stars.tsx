export default function Stars({ value }: { value: number }) {
  return (
    <div className="leading-none">
      {/* darker platinum for filled, subtle for remainder */}
      <span style={{ color: "#8E8E8E" }}>
        <span style={{color:"#b8b8b8"}}>{"★★★★★".slice(0, value)}</span>
      </span>
      <span style={{ color: "rgba(142,142,142,0.28)" }}>
        {"★★★★★".slice(value)}
      </span>
    </div>
  );
}
