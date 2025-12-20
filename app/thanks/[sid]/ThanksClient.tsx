"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type ApiResp = {
  ok: boolean;
  email?: string | null;
  resolved?: { name: string; resolved_url: string | null }[];
  error?: string;
};

export default function ThanksClient({ sid }: { sid: string }) {
  const [data, setData] = useState<ApiResp | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const ready = useMemo(
    () => (data?.resolved || []).filter((x) => x.resolved_url),
    [data]
  );

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
          // We didn't get links in time; keep the UI helpful
          setStatus("ready");
          return;
        }

        setTimeout(tick, 2500);
      } catch (e) {
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

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">You’re in. ✅</h1>

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

        <div className="mt-7 space-y-3">
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
              We’re generating your secure links now… (If you don’t see a button soon, use your email receipt.)
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
