"use client";

import { useRef } from "react";

type Props = {
  payhipCode: string;
  slug: string;
  title: string;
  price: number;
  children?: React.ReactNode;
};

export default function CheckoutButton({
  payhipCode,
  slug,
  title,
  price,
  children,
}: Props) {
  const anchorRef = useRef<HTMLAnchorElement | null>(null);
  const href = `https://payhip.com${payhipCode}`;

  const handleClick = () => {
    try {
      // @ts-ignore
      window.gtag?.("event", "begin_checkout", {
        currency: "USD",
        value: price,
        items: [
          {
            item_id: slug,
            item_name: title,
            item_brand: "WalkPerro",
            price,
          },
        ],
        source: "walkperro.com",
        method: "payhip",
      });
    } catch (_) {}

    anchorRef.current?.click();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center justify-center rounded-full border border-emerald px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-emerald hover:bg-emerald hover:text-ink transition-colors"
      >
        {children ?? "Get it →"}
      </button>
      <a ref={anchorRef} href={href} className="hidden" aria-hidden="true" />
    </>
  );
}
