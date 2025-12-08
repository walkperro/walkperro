"use client";
import BuyButton from "@/components/BuyButton";

export default function CheckoutButton(
  { priceId, label = "Buy Now", className }: { priceId: string; label?: string; className?: string }
) {
  // Wrap BuyButton so callers can pass className for styling
  return (
    <div className={className}>
      <BuyButton priceId={priceId} label={label} />
    </div>
  );
}
