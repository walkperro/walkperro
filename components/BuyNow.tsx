"use client";
import BuyButton from "@/components/BuyButton";
import { PRICES } from "@/lib/prices";

export default function BuyNow({ sku, label }: { sku: keyof typeof PRICES; label?: string }) {
  return <BuyButton priceIds={[PRICES[sku]]} label={label ?? "Buy Now"} />;
}
