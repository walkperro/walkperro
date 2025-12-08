"use client";
import { useState } from "react";

export default function BuyButton({
  priceId,
  label = "Buy Now",
  className = "",
}: { priceId: string; label?: string; className?: string }) {
  const [loading, setLoading] = useState(false);
  async function handleClick() {
    try {
      setLoading(true);
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceIds: [priceId], successPath: "/thanks" }),
      });
      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert("Checkout failed.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        "inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-2 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-60 " +
        className
      }
    >
      {loading ? "Processing…" : label}
    </button>
  );
}
