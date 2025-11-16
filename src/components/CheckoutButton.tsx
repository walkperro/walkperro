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
        className="inline-flex items-center justify-center rounded-full border border-slate-500/70 bg-transparent px-5 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-slate-100 hover:border-emerald-300 hover:bg-emerald-300/10 hover:text-emerald-200 transition-colors"
      >
        {children ?? "Get it →"}
      </button>
      <a ref={anchorRef} href={href} className="hidden" aria-hidden="true" />
    </>
  );
}
