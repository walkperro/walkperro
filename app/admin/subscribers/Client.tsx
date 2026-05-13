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

  const bySource = Array.from(
    rows.reduce((m, r) => m.set(r.source, (m.get(r.source) || 0) + 1), new Map<string, number>())
  ).slice(0, 4).map(([s, n]) => `${s} ${n}`).join(" · ") || "—";

  return (
    <div>
      {/* Stats — stack on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-line border border-line mb-6 sm:mb-8">
        <Stat label="TOTAL" value={String(total)} />
        <Stat label="THIS WEEK" value={String(thisWeek)} />
        <Stat label="BY SOURCE" value={bySource} small />
      </div>

      {/* Filters — stack on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
        <label className="block flex-1 sm:max-w-md">
          <span className="label block mb-2">SEARCH</span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchRows()}
            placeholder="email contains…"
            className="w-full font-mono text-base sm:text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
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
          className="label px-3 py-2 border border-charcoal hover:bg-charcoal hover:text-bone whitespace-nowrap"
        >
          EXPORT CSV →
        </button>
      </div>

      {/* List */}
      <div className="border border-line">
        {/* Desktop column headers */}
        <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] label py-3 px-4 bg-line/40">
          <span>EMAIL</span><span>SOURCE</span><span>STATUS</span><span>CREATED</span>
        </div>

        {loading && <p className="label p-6">// LOADING…</p>}
        {!loading && rows.length === 0 && <p className="label p-6 text-smoke">// NO SUBSCRIBERS YET.</p>}

        {/* Rows: desktop = grid columns, mobile = stacked card */}
        {!loading && rows.map((r) => (
          <div key={r.id} className="border-t border-line">
            {/* Desktop row */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr] py-3 px-4 text-sm">
              <span className="font-mono break-all">{r.email}</span>
              <span className="label">{r.source}</span>
              <span className="label">{r.status}</span>
              <span className="label text-smoke">{relative(r.created_at)}</span>
            </div>
            {/* Mobile card */}
            <div className="md:hidden py-4 px-4">
              <p className="font-mono text-sm break-all">{r.email}</p>
              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                <span className="label">{r.source}</span>
                <span className="label">{r.status}</span>
                <span className="label text-smoke">{relative(r.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="bg-bone p-4 sm:p-5">
      <p className="label">{label}</p>
      <p className={`font-display ${small ? "text-base mt-2" : "text-2xl mt-2"} break-words`}>{value}</p>
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
