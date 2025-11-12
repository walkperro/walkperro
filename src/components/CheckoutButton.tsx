"use client";
import { useRef } from "react";

export default function CheckoutButton({
  payhipCode,
  children,
}: {
  payhipCode: string;
  children?: React.ReactNode;
}) {
  const aRef = useRef<HTMLAnchorElement>(null);
  const open = () => aRef.current?.click();
  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center rounded-2xl px-6 py-3 bg-emerald text-bone hover:bg-bone hover:text-ink transition-colors"
      >
        {children ?? "Get it →"}
      </button>
      <a
        ref={aRef}
        href={`https://payhip.com/b/${payhipCode}`}
        className="payhip-buy-button hidden"
        data-theme="dark"
      >Buy</a>
    </>
  );
}
