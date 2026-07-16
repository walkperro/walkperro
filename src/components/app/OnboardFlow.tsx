"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { DemoAnalysis, DemoOpportunity } from "@/lib/pipeline/demo";

type Phase = "input" | "analyzing" | "results";

type UIOpportunity = {
  id: string;
  title: string;
  angle: string;
  description: string;
  demandScore: number;
};

type UIAnalysis = {
  handle: string;
  videoCount: number;
  transcriptCount: number;
  totalViews: number;
  opportunities: UIOpportunity[];
};

const STAGES = [
  { key: "scan", label: "reading your posts" },
  { key: "transcribe", label: "pulling transcripts" },
  { key: "analyze", label: "finding your patterns" },
  { key: "cluster", label: "shaping products" },
] as const;

function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

function fromDemo(a: DemoAnalysis): UIAnalysis {
  return {
    handle: a.profile.handle,
    videoCount: a.videoCount,
    transcriptCount: a.transcriptCount,
    totalViews: a.totalViews,
    opportunities: a.opportunities.map((o: DemoOpportunity) => ({
      id: o.id,
      title: o.title,
      angle: o.angle,
      description: o.description,
      demandScore: o.demandScore,
    })),
  };
}

function CountUp({ value, ms = 900 }: { value: number; ms?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!Number.isFinite(value)) {
      setN(0);
      return;
    }
    // setInterval (not rAF) so the count still lands on the final value in
    // non-painting/background contexts; always ends exactly on `value`.
    const steps = 28;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      const p = i / steps;
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (i >= steps) {
        setN(value);
        clearInterval(id);
      }
    }, ms / steps);
    return () => clearInterval(id);
  }, [value, ms]);
  return <>{n.toLocaleString()}</>;
}

export default function OnboardFlow({ demo = false }: { demo?: boolean }) {
  const [phase, setPhase] = useState<Phase>("input");
  const [url, setUrl] = useState(
    demo ? "https://www.tiktok.com/@prepwithsam" : ""
  );
  const [stageIdx, setStageIdx] = useState(0);
  const [analysis, setAnalysis] = useState<UIAnalysis | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pollTimer.current) clearTimeout(pollTimer.current);
    },
    []
  );

  const runDemo = useCallback(async () => {
    const per = 850;
    STAGES.forEach((_, i) =>
      setTimeout(() => setStageIdx(i), i * per)
    );
    const [res] = await Promise.all([
      fetch("/api/demo/analyze").then((r) => r.json() as Promise<DemoAnalysis>),
      new Promise((r) => setTimeout(r, STAGES.length * per + 350)),
    ]);
    setAnalysis(fromDemo(res));
    setStageIdx(STAGES.length);
    setSelected(res.opportunities[0]?.id ?? null);
    setPhase("results");
  }, []);

  const pollRun = useCallback((runId: string) => {
    const stageMap: Record<string, number> = {
      queued: 0,
      scraping: 0,
      scraped: 1,
      transcribing: 1,
      analyzing: 2,
      clustering: 3,
      done: 4,
    };
    const tick = async () => {
      try {
        const r = await fetch(`/api/pipeline/${runId}`).then((x) => x.json());
        if (r.error) {
          setError(String(r.error));
          setPhase("input");
          return;
        }
        setStageIdx(stageMap[r.stage as string] ?? 0);
        if (r.status === "succeeded") {
          const opps = (r.opportunities as Array<Record<string, unknown>>).map(
            (o) => ({
              id: String(o.id),
              title: String(o.title),
              angle: String(o.angle ?? ""),
              description: String(o.description ?? ""),
              demandScore: Number(o.demand_score ?? 0),
            })
          );
          const detail = (r.detail ?? {}) as Record<string, number>;
          setAnalysis({
            handle: "",
            videoCount: detail.videos_found ?? opps.length,
            transcriptCount: detail.transcribed ?? 0,
            totalViews: detail.total_views ?? 0,
            opportunities: opps,
          });
          setSelected(opps[0]?.id ?? null);
          setPhase("results");
          return;
        }
        if (r.status === "failed") {
          setError(String(r.error ?? "analysis failed"));
          setPhase("input");
          return;
        }
        pollTimer.current = setTimeout(tick, 1500);
      } catch (e) {
        setError((e as Error).message);
        setPhase("input");
      }
    };
    tick();
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setStageIdx(0);
    setAnalysis(null);
    setPhase("analyzing");
    if (demo) {
      await runDemo();
      return;
    }
    try {
      const res = await fetch("/api/pipeline/start", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? "could not start");
      pollRun(body.runId as string);
    } catch (e) {
      setError((e as Error).message);
      setPhase("input");
    }
  }, [demo, url, runDemo, pollRun]);

  // ── INPUT ────────────────────────────────────────────────────────────────
  if (phase === "input") {
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-24">
        <div className="mb-5 flex items-center gap-3">
          <span className="inline-block h-2.5 w-2.5 bg-signal" aria-hidden />
          <span className="label">// paste your profile</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">
          turn everything you&apos;ve posted into something you sell.
        </h1>
        <p className="mt-6 max-w-prose text-lg text-smoke">
          drop your tiktok, instagram, or youtube. we read your whole account —
          the words, the topics, the way you talk — and show you exactly what you
          could sell in the next minute.
        </p>

        <form
          className="mt-10"
          onSubmit={(e) => {
            e.preventDefault();
            if (url.trim()) start();
          }}
        >
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.tiktok.com/@yourhandle"
              className="min-w-0 flex-1 border border-charcoal bg-transparent px-4 py-3.5 font-mono text-sm text-charcoal placeholder:text-smoke focus:outline-none focus:ring-1 focus:ring-charcoal"
              spellCheck={false}
              autoComplete="off"
            />
            <button
              type="submit"
              className="shrink-0 border border-charcoal bg-charcoal px-6 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-bone transition-colors duration-150 hover:bg-signal hover:text-charcoal"
            >
              analyze my account
            </button>
          </div>
          {error && (
            <p className="mt-3 font-mono text-xs text-charcoal">
              {error === "unrecognized_url"
                ? "that link didn't parse. paste a profile url, not a single video."
                : error}
            </p>
          )}
        </form>

        <p className="mt-6 font-mono text-xs text-smoke">
          {demo
            ? "// demo — runs on a sample creator, no login needed"
            : "// free to start. you only pay us when something sells."}
        </p>
      </div>
    );
  }

  // ── ANALYZING ──────────────────────────────────────────────────────────────
  if (phase === "analyzing") {
    const pct = Math.min(100, Math.round((stageIdx / STAGES.length) * 100));
    return (
      <div className="mx-auto w-full max-w-2xl px-6 py-24">
        <span className="label">// analyzing</span>
        <h1 className="mt-5 font-display text-4xl leading-[1.0] tracking-[-0.02em] sm:text-5xl">
          reading everything you&apos;ve ever posted.
        </h1>

        <div className="mt-12 h-px w-full bg-line">
          <div
            className="h-px bg-signal transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ul className="mt-8 space-y-4">
          {STAGES.map((s, i) => {
            const done = i < stageIdx;
            const active = i === stageIdx;
            return (
              <li key={s.key} className="flex items-center gap-4">
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center border font-mono text-[10px] ${
                    done
                      ? "border-charcoal bg-charcoal text-bone"
                      : active
                        ? "border-charcoal text-charcoal"
                        : "border-line text-smoke"
                  }`}
                >
                  {done ? "✓" : String(i + 1)}
                </span>
                <span
                  className={`font-mono text-sm ${
                    done || active ? "text-charcoal" : "text-smoke"
                  }`}
                >
                  {s.label}
                  {active && <span className="ml-1 animate-pulse">…</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  const a = analysis!;
  const topId = a.opportunities[0]?.id;
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-20">
      <span className="label">// analysis complete</span>
      <h1 className="mt-5 font-display text-5xl leading-[0.95] tracking-[-0.03em] sm:text-6xl">
        <CountUp value={a.videoCount} /> videos analyzed.
      </h1>
      <p className="mt-5 font-mono text-sm text-smoke">
        {a.transcriptCount > 0 && (
          <>
            {a.transcriptCount} transcripts read
            {a.totalViews > 0 && " · "}
          </>
        )}
        {a.totalViews > 0 && <>{fmtViews(a.totalViews)} total views</>}
      </p>

      <div className="mt-14 mb-6 flex items-baseline justify-between">
        <h2 className="font-display text-2xl tracking-[-0.01em]">
          here&apos;s what you can sell
        </h2>
        <span className="label">// ranked by demand</span>
      </div>

      <ul className="hairline">
        {a.opportunities.map((o, i) => {
          const isSel = selected === o.id;
          const isTop = o.id === topId;
          return (
            <li key={o.id} className="border-b border-line">
              <button
                onClick={() => setSelected(o.id)}
                className={`block w-full px-1 py-6 text-left transition-colors ${
                  isSel ? "bg-[color:rgba(14,14,14,0.03)]" : ""
                }`}
              >
                <div className="flex items-start gap-5">
                  <span className="mt-1 font-mono text-xs text-smoke">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-2xl leading-tight tracking-[-0.01em]">
                        {o.title}
                      </span>
                      {isSel && (
                        <span className="label !text-charcoal">// selected</span>
                      )}
                    </div>
                    <p className="mt-1.5 text-smoke">{o.angle}</p>
                    <p className="mt-3 font-mono text-xs text-smoke">
                      {o.description}
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="h-1 w-40 max-w-[40vw] bg-line">
                        <div
                          className={`h-1 ${isTop ? "bg-signal" : "bg-charcoal"}`}
                          style={{ width: `${o.demandScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
                        {o.demandScore}% demand
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          disabled={!selected}
          className="border border-charcoal bg-charcoal px-6 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-bone transition-colors duration-150 hover:enabled:bg-signal hover:enabled:text-charcoal disabled:opacity-40"
          onClick={() => {
            /* generation is the next slice — this flow ends at the picker */
          }}
        >
          make “{a.opportunities.find((o) => o.id === selected)?.title ?? "this"}”
        </button>
        <button
          onClick={() => {
            setPhase("input");
            setAnalysis(null);
            setSelected(null);
          }}
          className="font-mono text-xs uppercase tracking-[0.08em] text-smoke hover:text-charcoal"
        >
          ← start over
        </button>
      </div>

      {demo && (
        <p className="mt-8 font-mono text-xs text-smoke">
          // demo ends here — picking a product kicks off generation in the next
          build slice.
        </p>
      )}
    </div>
  );
}
