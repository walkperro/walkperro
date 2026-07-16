"use client";

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-fetch";

type Row = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  platform: string;
  handle: string;
  other_links: string | null;
  niche: string | null;
  audience_size: string | null;
  q_always_ask: string | null;
  q_result: string | null;
  q_would_charge: string | null;
  status: string;
  notes: string | null;
  stripe_account_id: string | null;
  product_title: string | null;
  price_cents: number | null;
  payment_link_url: string | null;
};

const STATUSES = ["new", "building", "delivered", "live", "selling"] as const;

function timeAgo(iso: string): string {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (d < 3600) return `${Math.max(1, Math.floor(d / 60))}m ago`;
  if (d < 86400) return `${Math.floor(d / 3600)}h ago`;
  return `${Math.floor(d / 86400)}d ago`;
}

export default function IntakeClient() {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null); // "<id>:<action>"
  const [flash, setFlash] = useState<string | null>(null);

  const load = useCallback(async () => {
    const url = filter ? `/api/admin/intake?status=${filter}` : "/api/admin/intake";
    const res = await apiFetch(url);
    const body = await res.json();
    if (body.ok) setRows(body.rows);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load]);

  async function patch(id: string, fields: Record<string, string>) {
    const res = await apiFetch(`/api/admin/intake/${id}`, {
      method: "PATCH",
      body: JSON.stringify(fields),
    });
    const body = await res.json();
    if (body.ok)
      setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...body.row } : r)));
  }

  async function copy(text: string, note: string) {
    try {
      await navigator.clipboard.writeText(text);
      setFlash(note);
      setTimeout(() => setFlash(null), 2500);
    } catch {
      window.prompt("copy this:", text);
    }
  }

  async function createOnboarding(row: Row) {
    setBusy(`${row.id}:onboard`);
    try {
      const res = await apiFetch(`/api/admin/intake/${row.id}/express-account`, {
        method: "POST",
        body: JSON.stringify({}),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error);
      setRows((rs) =>
        rs.map((r) =>
          r.id === row.id ? { ...r, stripe_account_id: body.accountId } : r
        )
      );
      await copy(body.url, "onboarding link copied — send it to the creator");
    } catch (e) {
      setFlash(`stripe error: ${(e as Error).message}`);
      setTimeout(() => setFlash(null), 4000);
    } finally {
      setBusy(null);
    }
  }

  async function createPaymentLink(row: Row) {
    const title = window.prompt("product title:", row.product_title ?? "");
    if (!title) return;
    const priceStr = window.prompt(
      "price in dollars (e.g. 19):",
      row.price_cents ? String(row.price_cents / 100) : "19"
    );
    if (!priceStr) return;
    const priceCents = Math.round(parseFloat(priceStr) * 100);
    if (!Number.isFinite(priceCents) || priceCents < 100) {
      setFlash("price must be at least $1");
      setTimeout(() => setFlash(null), 3000);
      return;
    }
    setBusy(`${row.id}:link`);
    try {
      const res = await apiFetch(`/api/admin/intake/${row.id}/payment-link`, {
        method: "POST",
        body: JSON.stringify({ title, price_cents: priceCents }),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error);
      setRows((rs) =>
        rs.map((r) =>
          r.id === row.id
            ? { ...r, product_title: title, price_cents: priceCents, payment_link_url: body.url }
            : r
        )
      );
      await copy(body.url, "payment link copied — 80/20 split is live");
    } catch (e) {
      setFlash(`stripe error: ${(e as Error).message}`);
      setTimeout(() => setFlash(null), 4000);
    } finally {
      setBusy(null);
    }
  }

  const counts = rows.reduce(
    (m, r) => m.set(r.status, (m.get(r.status) || 0) + 1),
    new Map<string, number>()
  );

  return (
    <div>
      {flash && (
        <div className="mb-4 border border-charcoal bg-signal px-4 py-2 font-mono text-xs">
          {flash}
        </div>
      )}

      {/* status filter chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("")}
          className={`label border px-3 py-2 ${!filter ? "border-charcoal bg-charcoal !text-bone" : "border-line"}`}
        >
          ALL ({rows.length})
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`label border px-3 py-2 ${filter === s ? "border-charcoal bg-charcoal !text-bone" : "border-line"}`}
          >
            {s.toUpperCase()}
            {!filter && counts.get(s) ? ` (${counts.get(s)})` : ""}
          </button>
        ))}
      </div>

      {rows.length === 0 && (
        <p className="font-mono text-sm text-smoke">no submissions yet.</p>
      )}

      <ul className="space-y-px">
        {rows.map((r) => {
          const open = openId === r.id;
          return (
            <li key={r.id} className="border border-line bg-bone">
              {/* row header */}
              <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                <button
                  onClick={() => setOpenId(open ? null : r.id)}
                  className="font-mono text-xs text-smoke"
                >
                  {open ? "▾" : "▸"}
                </button>
                <span className="font-mono text-sm">{r.name}</span>
                <a
                  className="font-mono text-xs text-smoke hover:text-charcoal"
                  href={`https://www.${r.platform}.com/@${r.handle}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {r.platform}/@{r.handle}
                </a>
                {r.niche && (
                  <span className="font-mono text-xs text-smoke">· {r.niche}</span>
                )}
                {r.audience_size && (
                  <span className="font-mono text-xs text-smoke">
                    · {r.audience_size}
                  </span>
                )}
                <span className="ml-auto font-mono text-xs text-smoke">
                  {timeAgo(r.created_at)}
                </span>
                <select
                  value={r.status}
                  onChange={(e) => patch(r.id, { status: e.target.value })}
                  className="border border-charcoal bg-transparent px-2 py-1 font-mono text-xs uppercase"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* expanded detail */}
              {open && (
                <div className="space-y-4 border-t border-line px-4 py-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <span className="label block">EMAIL</span>
                      <button
                        className="font-mono text-sm hover:bg-signal"
                        onClick={() => copy(r.email, "email copied")}
                      >
                        {r.email}
                      </button>
                    </div>
                    {r.phone && (
                      <div>
                        <span className="label block">PHONE</span>
                        <span className="font-mono text-sm">{r.phone}</span>
                      </div>
                    )}
                  </div>

                  {r.q_always_ask && (
                    <div>
                      <span className="label block">ALWAYS ASKED</span>
                      <p className="text-sm">{r.q_always_ask}</p>
                    </div>
                  )}
                  {r.q_result && (
                    <div>
                      <span className="label block">RESULT</span>
                      <p className="text-sm">{r.q_result}</p>
                    </div>
                  )}
                  {r.q_would_charge && (
                    <div>
                      <span className="label block">WOULD CHARGE</span>
                      <p className="text-sm">{r.q_would_charge}</p>
                    </div>
                  )}
                  {r.other_links && (
                    <div>
                      <span className="label block">OTHER LINKS</span>
                      <p className="font-mono text-xs">{r.other_links}</p>
                    </div>
                  )}

                  {/* stripe actions */}
                  <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
                    <button
                      onClick={() => createOnboarding(r)}
                      disabled={busy === `${r.id}:onboard`}
                      className="border border-charcoal px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] hover:bg-charcoal hover:text-bone disabled:opacity-40"
                    >
                      {busy === `${r.id}:onboard`
                        ? "working…"
                        : r.stripe_account_id
                          ? "new onboarding link"
                          : "create stripe + onboarding link"}
                    </button>
                    <button
                      onClick={() => createPaymentLink(r)}
                      disabled={!r.stripe_account_id || busy === `${r.id}:link`}
                      className="border border-charcoal px-3 py-2 font-mono text-xs uppercase tracking-[0.08em] hover:enabled:bg-charcoal hover:enabled:text-bone disabled:opacity-40"
                    >
                      {busy === `${r.id}:link` ? "working…" : "create payment link (80/20)"}
                    </button>
                    {r.stripe_account_id && (
                      <span className="font-mono text-[11px] text-smoke">
                        acct: {r.stripe_account_id}
                      </span>
                    )}
                    {r.payment_link_url && (
                      <button
                        onClick={() => copy(r.payment_link_url!, "payment link copied")}
                        className="font-mono text-[11px] text-smoke underline hover:text-charcoal"
                      >
                        {r.product_title} — $
                        {((r.price_cents ?? 0) / 100).toFixed(0)} (copy link)
                      </button>
                    )}
                  </div>

                  {/* notes */}
                  <div>
                    <span className="label block mb-1">NOTES</span>
                    <textarea
                      defaultValue={r.notes ?? ""}
                      rows={2}
                      onBlur={(e) => {
                        if (e.target.value !== (r.notes ?? ""))
                          patch(r.id, { notes: e.target.value });
                      }}
                      className="w-full border border-line bg-transparent px-3 py-2 font-mono text-xs focus:border-charcoal focus:outline-none"
                      placeholder="ops notes — saves on blur"
                    />
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
