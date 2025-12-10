"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Props = { priceId: string; promotionCodeId?: string };

export default function EmbeddedCheckout({ priceId, promotionCodeId }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready || !hostRef.current) return;
    // @ts-ignore injected by Stripe script
    const stripe = (window as any).Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) return;

    const fetchClientSecret = async () => {
      const res = await fetch("/api/embedded-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, promotionCodeId }),
      });
      const data = await res.json();
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
  }, [ready, priceId, promotionCodeId]);

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
        onError={() => console.error("Stripe v3 failed to load")}
      />
      <div ref={hostRef} id="checkout" className="min-h-[560px]" />
    </>
  );
}
