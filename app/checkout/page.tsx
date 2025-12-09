import { Suspense } from "react";
import ClientCheckout from "./ClientCheckout";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function CheckoutPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-50 text-slate-900"><div className="mx-auto max-w-3xl px-4 py-10"><p className="text-sm text-slate-600">Loading checkout…</p></div></main>}>
      <ClientCheckout />
    </Suspense>
  );
}
