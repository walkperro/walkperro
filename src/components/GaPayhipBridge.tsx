"use client";
import { useEffect } from "react";

/**
 * Listens for clicks on <a class="payhip-buy-button">…</a>
 * and fires a GA4 begin_checkout event with basic item info.
 */
export default function GaPayhipBridge() {
  useEffect(() => {
    const handler = (e: Event) => {
      const node = e.target as HTMLElement | null;
      const anchor = node?.closest?.("a.payhip-buy-button") as HTMLAnchorElement | null;
      if (!anchor) return;

      try {
        const url = new URL(anchor.href);
        const code = url.pathname.split("/").pop() || "unknown";
        const content = url.searchParams.get("utm_content") || code;

        // @ts-ignore
        window.gtag?.("event", "begin_checkout", {
          currency: "USD",
          items: [
            {
              item_id: content,
              item_name: content,
              item_brand: "WalkPerro",
            },
          ],
          source: "site",
          method: "payhip",
        });
      } catch {}
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return null;
}
