"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ClientCheckout() {
  const sp = useSearchParams();
  const price = sp.get("price");

  useEffect(() => {
    if (!price) return;

    // Load Stripe embedded script if it isn't present
    const ensureScript = async () => {
      if (!document.querySelector('script[src^="https://js.stripe.com/v3/embedded.js"]')) {
        await new Promise<void>((resolve) => {
          const s = document.createElement("script");
          s.src = "https://js.stripe.com/v3/embedded.js";
          s.onload = () => resolve();
          document.head.appendChild(s);
        });
      }
    };

    const mount = async () => {
      // @ts-ignore - global injected by stripe script
      const stripe = (window as any).Stripe?.(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      if (!stripe) return;

      const fetchClientSecret = async () => {
        const res = await fetch("/api/embedded-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId: price }),
        });
        if (!res.ok) {
          throw new Error("Failed to create checkout session");
        }
        const { client_secret } = await res.json();
        return client_secret as string;
      };

      const checkout = await stripe.initEmbeddedCheckout({ fetchClientSecret });
      checkout.mount("#checkout");
    };

    ensureScript().then(mount);
  }, [price]);

  return null;
}
