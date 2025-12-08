import Image from "next/image";
import BuyButton from "@/components/BuyButton";

type Props = {
  name: string;
  eyebrow: string;
  price: string;
  coverImage: string | null;
  bullets: string[];
  footerLine?: string;
  stripePriceId: string;
  onOpen?: () => void;
};

export default function ProductCard({
  name, eyebrow, price, coverImage, bullets, footerLine, stripePriceId
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-600">{eyebrow}</div>
      <h3 className="mt-1 text-xl font-semibold tracking-tight">{name}</h3>
      <div className="mt-1 text-slate-500">{price}</div>

      {coverImage && (
        <div className="mt-4 overflow-hidden rounded-xl">
          <Image src={coverImage} alt={name} width={1200} height={900} className="w-full h-auto" />
        </div>
      )}

      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>

      {footerLine && <p className="mt-3 text-xs text-slate-500">{footerLine}</p>}

      <div className="mt-5">
        <BuyButton priceId={stripePriceId} label={`Buy Now — ${price}`} />
      </div>
    </div>
  );
}
