// components/BuyButton.tsx
"use client";
import React, { useState } from "react";

export default function BuyButton({ priceIds, label = "Buy Now" }: { priceIds: string[]; label?: string }) {
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceIds })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={go} disabled={loading} className="px-4 py-2 rounded bg-black text-white">
      {loading ? "Redirecting..." : label}
    </button>
  );
}