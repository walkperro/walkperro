type Tile = { index: string; label: string; status?: string };

const ROW_A: Tile[] = [
  { index: "01", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "02", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "03", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "04", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "05", label: "Project — Coming Soon", status: "DRAFTING" },
];

const ROW_B: Tile[] = [
  { index: "06", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "07", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "08", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "09", label: "Project — Coming Soon", status: "DRAFTING" },
  { index: "10", label: "Project — Coming Soon", status: "DRAFTING" },
];

function TileCard({ tile }: { tile: Tile }) {
  return (
    <div className="shrink-0 w-[320px] h-[200px] border border-line bg-bone p-5 flex flex-col justify-between">
      <p className="label">// {tile.index}</p>
      <div>
        <p className="font-display text-2xl leading-tight">{tile.label}</p>
        {tile.status && (
          <p className="label mt-2 text-charcoal/60">{tile.status}</p>
        )}
      </div>
    </div>
  );
}

function Row({ tiles, reverse = false }: { tiles: Tile[]; reverse?: boolean }) {
  // duplicate for seamless loop
  const items = [...tiles, ...tiles];
  return (
    <div className="marquee-mask overflow-hidden">
      <div className={`marquee-row ${reverse ? "reverse" : ""}`}>
        {items.map((t, i) => (
          <TileCard key={`${t.index}-${i}`} tile={t} />
        ))}
      </div>
    </div>
  );
}

export default function PortfolioMarquee() {
  return (
    <div className="space-y-6">
      <Row tiles={ROW_A} />
      <Row tiles={ROW_B} reverse />
    </div>
  );
}
