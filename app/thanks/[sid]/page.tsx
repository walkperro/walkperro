"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ApiResp = {
  ok: boolean;
  email?: string | null;
  error?: string;
  resolved?: { name: string; resolved_url: string | null }[];
};

export default function ThanksSidPage({ params }: { params: { sid: string } }) {
  const sid = params.sid;

  const [data, setData] = useState<ApiResp | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadOnce() {
    const r = await fetch(`/api/thanks/${encodeURIComponent(sid)}`, { cache: "no-store" });
    const j = (await r.json()) as ApiResp;
    setData(j);
    return j;
  }

  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    const maxTries = 12; // ~18s if interval is 1500ms

    async function tick() {
      try {
        const j = await loadOnce();
        if (cancelled) return;

        const ready = (j.resolved || []).some(x => !!x.resolved_url);
        setLoading(!ready);

        if (ready || !j.ok) return; // stop if ready or hard error
      } catch (e) {
        if (cancelled) return;
        setData({ ok: false, error: "Failed to load downloads." });
        setLoading(false);
        return;
      }

      tries++;
      if (tries < maxTries) {
        setTimeout(tick, 1500);
      } else {
        setLoading(false);
      }
    }

    tick();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sid]);

  const email = data?.email || "";
  const ready = useMemo(
    () => (data?.resolved || []).filter(x => x.resolved_url),
    [data]
  );

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">Order confirmed</h1>

        <p className="mt-3 text-slate-300 leading-relaxed">
          {email ? (
            <>Receipt + downloads were sent to <span className="font-medium text-slate-100">{email}</span>.</>
          ) : (
            <>Receipt + downloads were sent to your email.</>
          )}
        </p>

        <div className="mt-7 space-y-3">
          {ready.length ? (
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
          ) : loading ? (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
              We’re generating your secure links now…
            </div>
          ) : (
            <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
              We couldn’t load your downloads right now. Please use the links in your email receipt.
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-slate-400">
          Tip: secure links expire — if you need them again, use the email receipt.
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
