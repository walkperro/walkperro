"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-fetch";

type Row = {
  id: string;
  email: string;
  source: string;
  status: string;
  tags: string[];
  created_at: string;
};

const SOURCES = ["", "hero", "closehound", "tool:painmine", "footer"];

export default function SubscribersClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [thisWeek, setThisWeek] = useState(0);
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  async function fetchRows() {
    setLoading(true);
    try {
      const url = new URL("/api/admin/subscribers", window.location.origin);
      if (q) url.searchParams.set("q", q);
      if (source) url.searchParams.set("source", source);
      const res = await apiFetch(url.toString());
      const body = await res.json();
      if (body.ok) {
        setRows(body.rows);
        setTotal(body.total);
        setThisWeek(body.thisWeek);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRows(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [source]);

  function exportCsv() {
    window.location.href = "/api/admin/subscribers/export";
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-px bg-line border border-line mb-8">
        <Stat label="TOTAL" value={String(total)} />
        <Stat label="THIS WEEK" value={String(thisWeek)} />
        <Stat
          label="BY SOURCE"
          value={
            Array.from(rows.reduce((m, r) => m.set(r.source, (m.get(r.source) || 0) + 1), new Map<string, number>()))
              .slice(0, 4)
              .map(([s, n]) => `${s} ${n}`)
              .join(" · ") || "—"
          }
        />
      </div>

      {/* Filters */}
      <div className="flex items-end gap-4 mb-6">
        <label className="block flex-1 max-w-md">
          <span className="label block mb-2">SEARCH</span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRows()}
            placeholder="email contains…"
            className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
          />
        </label>
        <div className="flex gap-2 flex-wrap">
          {SOURCES.map((s) => (
            <button
              key={s || "all"}
              onClick={() => setSource(s)}
              className={`label px-3 py-2 border ${
                source === s ? "bg-charcoal text-bone border-charcoal" : "border-line hover:border-charcoal"
              }`}
            >
              {s ? s.toUpperCase() : "ALL"}
            </button>
          ))}
        </div>
        <button
          onClick={exportCsv}
          className="label px-3 py-2 border border-charcoal hover:bg-charcoal hover:text-bone"
        >
          EXPORT CSV →
        </button>
      </div>

      {/* Table */}
      <div className="border border-line">
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] label py-3 px-4 bg-line/40">
          <span>EMAIL</span><span>SOURCE</span><span>STATUS</span><span>CREATED</span>
        </div>
        {loading && <p className="label p-6">// LOADING…</p>}
        {!loading && rows.length === 0 && <p className="label p-6 text-smoke">// NO SUBSCRIBERS YET.</p>}
        {!loading && rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[2fr_1fr_1fr_1fr] py-3 px-4 border-t border-line text-sm">
            <span className="font-mono">{r.email}</span>
            <span className="label">{r.source}</span>
            <span className="label">{r.status}</span>
            <span className="label text-smoke">{relative(r.created_at)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-bone p-5">
      <p className="label">{label}</p>
      <p className="font-display text-2xl mt-2">{value}</p>
    </div>
  );
}

function relative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}
