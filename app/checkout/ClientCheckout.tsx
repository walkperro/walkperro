"use client";
/// <reference path="../../types/stripe-checkout.d.ts" />

import Script from "next/script";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ClientCheckout() {
  const params = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  const qsClientSecret = params.get("client_secret") || params.get("cs");
  const qsPrice = params.get("price");

  useEffect(() => {
    async function ensureClientSecret() {
      if (qsClientSecret) {
        setClientSecret(qsClientSecret);
        return;
      }
      if (qsPrice) {
        const res = await fetch(`/api/checkout?price=${encodeURIComponent(qsPrice)}`, { method: "GET" });
        const data = await res.json();
        if (data?.client_secret) {
          // update the URL so refresh keeps working
          const url = new URL(window.location.href);
          url.searchParams.delete("price");
          url.searchParams.set("client_secret", data.client_secret);
          history.replaceState({}, "", url.toString());
          setClientSecret(data.client_secret);
        } else {
          alert("Checkout failed.");
        }
      }
    }
    ensureClientSecret();
  }, [qsClientSecret, qsPrice]);

  if (!qsClientSecret && !qsPrice) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-slate-600">Missing price or client secret. Start from a product.</p>
        </div>
      </main>
    );
  }

  if (!clientSecret) {
    return (
      <main className="min-h-screen bg-slate-50 text-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <p className="text-sm text-slate-600">Loading checkout…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Script src="https://js.stripe.com/v3/embedded.js" strategy="afterInteractive" />
        {/* @ts-expect-error provided by Stripe script */}
        <stripe-checkout client-secret={clientSecret} publishable-key={pk} />
      </div>
    </main>
  );
}
