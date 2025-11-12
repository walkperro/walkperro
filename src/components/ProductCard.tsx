import { Card } from "@/components/ui/card";
import CheckoutButton from "./CheckoutButton";

export default function ProductCard({
  title, blurb, price, payhipCode,
}: {
  title: string; blurb: string; price: number; payhipCode: string;
}) {
  return (
    <Card className="bg-graphite/50 border border-graphite hover:border-emerald/50 rounded-2xl p-6 hover:-translate-y-0.5 transition-transform">
      <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-silver">{blurb}</p>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-base text-silver">${price.toFixed(2)}</span>
        <CheckoutButton payhipCode={payhipCode}>Get {title.split("|")[0].trim()} →</CheckoutButton>
      </div>
    </Card>
  );
}
