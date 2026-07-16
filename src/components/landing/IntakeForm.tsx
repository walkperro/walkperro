"use client";

import { useState } from "react";

const PLATFORMS = [
  { value: "tiktok", label: "tiktok" },
  { value: "instagram", label: "instagram" },
  { value: "youtube", label: "youtube" },
] as const;

const AUDIENCE = ["<10k", "10k-50k", "50k-200k", "200k+"] as const;

const inputCls =
  "w-full border border-charcoal bg-transparent px-4 py-3 font-mono text-sm text-charcoal placeholder:text-smoke focus:outline-none focus:ring-1 focus:ring-charcoal";
const labelCls = "label block mb-2";

export default function IntakeForm() {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [platform, setPlatform] = useState<string>("tiktok");
  const [audience, setAudience] = useState<string>("10k-50k");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: String(fd.get("name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim() || null,
      platform,
      handle: String(fd.get("handle") ?? "").trim().replace(/^@/, ""),
      other_links: String(fd.get("other_links") ?? "").trim() || null,
      niche: String(fd.get("niche") ?? "").trim() || null,
      audience_size: audience,
      q_always_ask: String(fd.get("q_always_ask") ?? "").trim() || null,
      q_result: String(fd.get("q_result") ?? "").trim() || null,
      q_would_charge: String(fd.get("q_would_charge") ?? "").trim() || null,
      website: String(fd.get("website") ?? ""), // honeypot
    };
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok || !body.ok) throw new Error(body.error ?? "server_error");
      setDone(true);
    } catch (err) {
      const msg = (err as Error).message;
      setError(
        msg === "invalid_email"
          ? "that email doesn't look right."
          : msg === "missing_fields"
            ? "name, email, and your handle are required."
            : "something broke on our end. try once more."
      );
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div className="border border-charcoal p-8 sm:p-10">
        <span className="label">// you&apos;re in</span>
        <h3 className="mt-4 font-display text-3xl leading-tight tracking-[-0.02em]">
          we&apos;re on it.
        </h3>
        <p className="mt-4 max-w-prose text-smoke">
          we&apos;ll read your account, build your product, and reach out within
          48 hours with what we made. nothing to pay. nothing to install.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* honeypot — hidden from humans */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>NAME</span>
          <input name="name" required className={inputCls} placeholder="sam" />
        </label>
        <label className="block">
          <span className={labelCls}>EMAIL</span>
          <input
            name="email"
            type="email"
            required
            className={inputCls}
            placeholder="you@email.com"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <span className={labelCls}>PLATFORM</span>
          <div className="flex gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPlatform(p.value)}
                className={`label border px-3 py-2.5 transition-colors ${
                  platform === p.value
                    ? "border-charcoal bg-charcoal !text-bone"
                    : "border-line hover:border-charcoal"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        <label className="block">
          <span className={labelCls}>YOUR HANDLE</span>
          <input
            name="handle"
            required
            className={inputCls}
            placeholder="@yourhandle"
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>NICHE</span>
          <input
            name="niche"
            className={inputCls}
            placeholder="meal prep, fitness, money…"
          />
        </label>
        <div>
          <span className={labelCls}>AUDIENCE SIZE</span>
          <div className="flex flex-wrap gap-2">
            {AUDIENCE.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAudience(a)}
                className={`label border px-3 py-2.5 transition-colors ${
                  audience === a
                    ? "border-charcoal bg-charcoal !text-bone"
                    : "border-line hover:border-charcoal"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      <label className="block">
        <span className={labelCls}>WHAT DO PEOPLE ALWAYS ASK YOU?</span>
        <textarea
          name="q_always_ask"
          rows={2}
          className={inputCls}
          placeholder="the question that shows up in every comment section"
        />
      </label>

      <label className="block">
        <span className={labelCls}>
          WHAT RESULT HAVE YOU GOTTEN THAT FOLLOWERS WANT?
        </span>
        <textarea
          name="q_result"
          rows={2}
          className={inputCls}
          placeholder="lost 30lbs, built a $10k/mo side business, learned spanish in a year…"
        />
      </label>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <label className="block">
          <span className={labelCls}>
            WHAT WOULD YOU CHARGE FOR YOUR BEST ADVICE?
          </span>
          <input
            name="q_would_charge"
            className={inputCls}
            placeholder="$20? $50? never thought about it?"
          />
        </label>
        <label className="block">
          <span className={labelCls}>PHONE (OPTIONAL)</span>
          <input
            name="phone"
            type="tel"
            className={inputCls}
            placeholder="for a faster back-and-forth"
          />
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>OTHER LINKS (OPTIONAL)</span>
        <input
          name="other_links"
          className={inputCls}
          placeholder="second account, website, linktree…"
        />
      </label>

      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={busy}
          className="border border-charcoal bg-charcoal px-8 py-4 font-mono text-xs uppercase tracking-[0.08em] text-bone transition-colors duration-150 hover:enabled:bg-signal hover:enabled:text-charcoal disabled:opacity-40"
        >
          {busy ? "sending…" : "build my product — free"}
        </button>
        <span className="font-mono text-xs text-smoke">
          // no card. no subscription. we take 20% only when it sells.
        </span>
      </div>

      {error && <p className="font-mono text-xs text-charcoal">{error}</p>}
    </form>
  );
}
