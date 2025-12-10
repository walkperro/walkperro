"use client";


import { useSearchParams } from "next/navigation";

import EmbeddedCheckout from "./EmbeddedCheckout";

export default function CheckoutPage() {
  const params = useSearchParams();
  const price = params.get("price") ?? "";
  const promo = params.get("promo") ?? undefined;

  if (!price) {
    return (
      <main className="min-h-[60vh] grid place-items-center p-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-700">
          Missing price. Please start checkout from a product button.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <EmbeddedCheckout priceId={price} promotionCodeId={promo} />
      </div>
    </main>
  );
}
