"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import RedirectGuard from "./RedirectGuard";

type Props = { priceId: string; promotionCodeId?: string; promotionCode?: string };

export default function EmbeddedCheckout({ priceId, promotionCodeId, promotionCode }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !hostRef.current) return;

    // @ts-ignore injected by Stripe script
    const stripe = (window as any).Stripe?.(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) return;

    const fetchClientSecret = async () => {
      const res = await fetch("/api/embedded-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, promotionCodeId, promotionCode }),
      });
      if (!res.ok) throw new Error("Failed to create checkout session");
      const data = await res.json();
      // Persist the session id defensively (the API returns it)
      if (data.session_id) {
        try { sessionStorage.setItem("last_checkout_session_id", data.session_id); } catch {}
      }
      const clientSecret = data.client_secret || data.clientSecret;
      if (!clientSecret) throw new Error("No client_secret from API");
      return clientSecret as string;
    };

    let destroyed = false;
    (async () => {
      const checkout = await stripe.initEmbeddedCheckout({ fetchClientSecret });
      if (!destroyed) checkout.mount(hostRef.current!);
    })();

    return () => { destroyed = true; };
  }, [ready, priceId, promotionCodeId, promotionCode]);

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onError={() => console.error("Stripe v3 failed to load")}
      />
      {/* safety redirect if Stripe forgets to append ?session_id */}
      <RedirectGuard />
      <div ref={hostRef} id="checkout" className="min-h-[560px]" />
    </>
  );
}
