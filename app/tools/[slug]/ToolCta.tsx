"use client";

import { useState } from "react";

type Props = {
  slug: string;
  priceCents: number;
  requiresEmail: boolean;
  hasFile: boolean;
  stripePriceId: string | null;
};

export default function ToolCta({ slug, priceCents, requiresEmail, hasFile, stripePriceId }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "ok" | "waitlisted" | "err">("idle");
  const [message, setMessage] = useState("");

  async function submitFree(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch(`/api/tools/${slug}/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 503 && body.error === "no_file_yet") {
        setState("waitlisted");
        setMessage("// SHIPS SOON — YOU'RE ON THE LIST.");
        return;
      }
      if (!res.ok) { setState("err"); setMessage(body.error || "FAILED — TRY AGAIN."); return; }
      setState("ok");
      setMessage("// CHECK YOUR EMAIL FOR THE LINK.");
    } catch {
      setState("err");
      setMessage("// FAILED — TRY AGAIN.");
    }
  }

  async function submitPaid(e: React.FormEvent) {
    e.preventDefault();
    if (state === "loading") return;
    setState("loading");
    try {
      const res = await fetch(`/api/tools/${slug}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();
      if (body.url) {
        window.location.href = body.url;
        return;
      }
      setState("err");
      setMessage(body.error || "CHECKOUT FAILED.");
    } catch {
      setState("err");
      setMessage("// FAILED — TRY AGAIN.");
    }
  }

  // FREE + no email
  if (priceCents <= 0 && !requiresEmail) {
    if (!hasFile) {
      return <p className="label text-smoke">// SHIPS SOON.</p>;
    }
    return (
      <a
        href={`/api/tools/${slug}/direct`}
        className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal"
      >
        DOWNLOAD →
      </a>
    );
  }

  // FREE + email
  if (priceCents <= 0) {
    if (state === "ok" || state === "waitlisted") {
      return <p className="label text-charcoal">{message}</p>;
    }
    return (
      <form onSubmit={submitFree} className="flex flex-col sm:flex-row gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 px-4 py-3 font-mono text-sm bg-transparent border border-charcoal focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="px-5 py-3 font-mono uppercase tracking-label text-[0.75rem] border border-l-0 border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
        >
          {state === "loading" ? "…" : "GET IT →"}
        </button>
        {state === "err" && <span className="label mt-2 sm:ml-3 sm:mt-3">{message}</span>}
      </form>
    );
  }

  // PAID
  if (!stripePriceId) {
    return <p className="label text-smoke">// STRIPE NOT CONFIGURED YET.</p>;
  }
  return (
    <form onSubmit={submitPaid} className="flex flex-col gap-3 max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="px-4 py-3 font-mono text-sm bg-transparent border border-charcoal focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="px-5 py-3 font-mono uppercase tracking-label text-[0.75rem] border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
      >
        {state === "loading" ? "…" : `GET IT — $${(priceCents / 100).toFixed(2)}`}
      </button>
      {state === "err" && <span className="label">{message}</span>}
    </form>
  );
}
