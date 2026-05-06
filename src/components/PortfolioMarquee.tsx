import Image from "next/image";
import { TOP_ROW, BOTTOM_ROW, type PortfolioItem } from "@/lib/portfolio";

function Tile({ item }: { item: PortfolioItem }) {
  return (
    <div className="shrink-0 w-[420px] h-[260px] border border-line bg-bone overflow-hidden relative">
      <Image
        src={item.src}
        alt={item.alt}
        fill
        sizes="420px"
        className="object-cover"
      />
    </div>
  );
}

function Row({
  items,
  reverse = false,
}: {
  items: PortfolioItem[];
  reverse?: boolean;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="marquee-mask overflow-hidden">
      <div className={`marquee-row ${reverse ? "reverse" : ""}`}>
        {doubled.map((item, i) => (
          <Tile key={`${item.src}-${i}`} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function PortfolioMarquee() {
  return (
    <div className="space-y-6">
      <Row items={TOP_ROW} />
      <Row items={BOTTOM_ROW} reverse />
    </div>
  );
}
