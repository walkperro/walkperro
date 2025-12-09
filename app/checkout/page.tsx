"use client";
/// <reference path="../../types/stripe-checkout.d.ts" />

import Script from "next/script";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useSearchParams();
  // support either ?client_secret=... or ?cs=...
  const clientSecret =
    params.get("client_secret") || params.get("cs") || "";

  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (!clientSecret) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-slate-600">
            Missing client secret. Try starting checkout again.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Script
          src="https://js.stripe.com/v3/embedded.js"
          strategy="afterInteractive"
        />
        {/* TS doesn't know this custom element at compile-time */}
        {/* @ts-expect-error custom element defined by Stripe script */}
        <stripe-checkout
          client-secret={clientSecret}
          publishable-key={pk}
        />
      </div>
    </main>
  );
}
