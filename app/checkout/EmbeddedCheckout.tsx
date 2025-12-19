"use client";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type Props = { priceId: string; promotionCodeId?: string; promotionCode?: string };

export default function EmbeddedCheckout({ priceId, promotionCodeId, promotionCode }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const checkoutRef = useRef<any>(null);
  const creatingRef = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!ready) return;
      if (!hostRef.current) return;

      // If we already mounted a checkout instance, destroy it first (important!)
      if (checkoutRef.current?.destroy) {
        try { checkoutRef.current.destroy(); } catch {}
        checkoutRef.current = null;
      } else if (checkoutRef.current?.unmount) {
        try { checkoutRef.current.unmount(); } catch {}
        checkoutRef.current = null;
      }

      if (creatingRef.current) return;
      creatingRef.current = true;

      try {
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

        const checkout = await stripe.initEmbeddedCheckout({ fetchClientSecret });
        if (cancelled) {
          try { checkout.destroy?.(); } catch {}
          return;
        }

        checkoutRef.current = checkout;
        checkout.mount(hostRef.current);
      } finally {
        creatingRef.current = false;
      }
    }

    run();

    return () => {
      cancelled = true;
      // Critical: teardown on unmount/navigation
      if (checkoutRef.current?.destroy) {
        try { checkoutRef.current.destroy(); } catch {}
      } else if (checkoutRef.current?.unmount) {
        try { checkoutRef.current.unmount(); } catch {}
      }
      checkoutRef.current = null;
      creatingRef.current = false;
    };
  }, [ready, priceId, promotionCodeId, promotionCode]);

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
