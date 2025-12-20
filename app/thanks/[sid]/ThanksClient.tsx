"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApiItem = {
  product_id?: string | null;
  product_name?: string | null;
  download_url?: string | null;
  supabase_path?: string | null;
};

type ApiResp = {
  ok: boolean;
  email?: string | null;
  items?: ApiItem[];
  resolved?: { name: string; resolved_url: string | null }[];
  error?: string;
};

function formatMMSS(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = String(Math.floor(s / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function ThanksClient({ sid }: { sid: string }) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // --- Countdown (20 min) ---
  const [msLeft, setMsLeft] = useState<number>(0);

  // DOG30 promo id comes from Vercel env
  const promoId = process.env.NEXT_PUBLIC_PROMO_DOG30_ID || "";

  // HARD-CODE All-In-One price id (no env var)
  const aioPriceId = "price_1SbmGUCCBLLo4EMcl3h2ZHKl";

  const upsellHref =
    promoId
      ? `/checkout?price=${encodeURIComponent(aioPriceId)}&promotionCodeId=${encodeURIComponent(
          promoId
        )}`
      : `/checkout?price=${encodeURIComponent(aioPriceId)}`;

  useEffect(() => {
    // Start a 20-min timer per session (persists on refresh)
    try {
      const key = `wp_dog30_deadline_${sid || "na"}`;
      const existing = sessionStorage.getItem(key);
      const deadline = existing ? Number(existing) : Date.now() + 20 * 60 * 1000;
      if (!existing) sessionStorage.setItem(key, String(deadline));

      const tick = () => setMsLeft(Math.max(0, deadline - Date.now()));
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    } catch {
      // If storage blocked, still show timer for this render
      const deadline = Date.now() + 20 * 60 * 1000;
      const tick = () => setMsLeft(Math.max(0, deadline - Date.now()));
      tick();
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }
  }, [sid]);

  const ready = useMemo(
    () => (data?.resolved || []).filter((x) => x.resolved_url),
    [data]
  );

  // ✅ Hide upsell if they already bought All-In-One
  const boughtAllInOne = useMemo(() => {
    const items = data?.items || [];
    return items.some((it) =>
      String(it.product_name || "")
        .toLowerCase()
        .includes("all-in-one")
    );
  }, [data]);

  useEffect(() => {
    let alive = true;
    let tries = 0;
    const maxTries = 10; // ~25-30 seconds total

    async function tick() {
      tries++;
      try {
        const r = await fetch(`/api/thanks/${encodeURIComponent(sid)}`, {
          cache: "no-store",
        });
        const j = (await r.json()) as ApiResp;
        if (!alive) return;

        setData(j);

        if (!j.ok) {
          setStatus("error");
          return;
        }

        const haveLinks = (j.resolved || []).some((x) => x.resolved_url);
        if (haveLinks) {
          setStatus("ready");
          return;
        }

        if (tries >= maxTries) {
          setStatus("ready");
          return;
        }

        setTimeout(tick, 2500);
      } catch {
        if (!alive) return;
        setStatus("error");
      }
    }

    tick();
    return () => {
      alive = false;
    };
  }, [sid]);

  const email = data?.email || "";
  const timerText = msLeft > 0 ? formatMMSS(msLeft) : "00:00";

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">You’re in.</h1>

        <p className="mt-3 text-slate-300 leading-relaxed">
          {email ? (
            <>
              Receipt + downloads were sent to{" "}
              <span className="font-medium text-slate-100">{email}</span>.
            </>
          ) : (
            <>Receipt + downloads were sent to your email.</>
          )}
        </p>

        {/* --- Upsell (DOG30) --- */}
        {!boughtAllInOne && (
          <div className="mt-7 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-emerald-300">
                  Limited-time upgrade
                </div>
                <div className="mt-1 text-lg font-semibold text-slate-100">
                  Get the All-In-One Toolkit Bundle
                </div>
                <p className="mt-1 text-sm text-slate-300">
                  Use code{" "}
                  <span className="font-semibold text-emerald-200">DOG30</span>{" "}
                  for 30% off.
                  <span className="ml-2 text-slate-400">
                    Offer expires in{" "}
                    <span className="font-mono text-slate-100">{timerText}</span>
                  </span>
                </p>
              </div>

              <Link
                href={upsellHref}
                className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-400"
              >
                Upgrade (-30%)
              </Link>
            </div>
          </div>
        )}

        {/* --- Downloads --- */}
        <div className="mt-6 space-y-3">
          {status === "error" ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
              We couldn’t load your downloads right now. Please use the links in your email receipt.
            </div>
          ) : ready.length ? (
            ready.map((d, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
              >
                <div className="text-slate-100 font-medium">{d.name}</div>
                <a
                  href={d.resolved_url!}
                  target="_blank"
                  rel="noopener"
                  className="shrink-0 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Download
                </a>
              </div>
            ))
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
              We’re generating your secure links now… (If you don’t see a button
              soon, use your email receipt.)
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Tip: secure links expire — if you need them again, use the email
          receipt.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-white px-5 py-2 text-slate-900 font-semibold hover:bg-slate-100"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
