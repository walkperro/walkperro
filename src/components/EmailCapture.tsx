"use client";
import { useState } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"ok"|"err"|"loading">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const r = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (r.ok) setStatus("ok"); else setStatus("err");
    } catch { setStatus("err"); }
  }

  return (
    <form onSubmit={submit} className="mt-10 flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        placeholder="you@domain.com"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        className="flex-1 rounded-2xl bg-graphite/40 border border-graphite px-4 py-3 outline-none focus:border-emerald/60"
      />
      <button
        disabled={status==="loading"}
        className="rounded-2xl px-6 py-3 bg-emerald text-bone hover:bg-bone hover:text-ink transition-colors disabled:opacity-60"
      >
        {status==="loading" ? "Joining…" : "Join the Exhibit"}
      </button>
      {status==="ok" && <div className="text-emerald/90 text-sm">Check your inbox — welcome.</div>}
      {status==="err" && <div className="text-red-400 text-sm">Something went wrong — try again.</div>}
    </form>
  );
}
