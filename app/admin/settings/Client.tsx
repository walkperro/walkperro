"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api-fetch";

type Session = {
  id: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  expires_at: string;
  revoked_at: string | null;
};

type AuditRow = {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

export default function SettingsClient({ totpEnabled }: { totpEnabled: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [pwMsg, setPwMsg] = useState<string | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [audit, setAudit] = useState<AuditRow[]>([]);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  async function load() {
    const [s, a] = await Promise.all([
      apiFetch("/api/admin/sessions").then((r) => r.json()),
      apiFetch("/api/admin/audit").then((r) => r.json()),
    ]);
    if (s.ok) setSessions(s.sessions);
    if (a.ok) setAudit(a.rows);
  }
  useEffect(() => { load(); }, []);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    const res = await apiFetch("/api/admin/settings/password", {
      method: "POST",
      body: JSON.stringify({ current, next }),
    });
    const body = await res.json();
    if (res.ok) {
      setPwMsg("// PASSWORD UPDATED.");
      setCurrent(""); setNext("");
    } else {
      setPwMsg(`// ${(body.error || "failed").toUpperCase()}`);
    }
  }

  async function regenBackup() {
    const res = await apiFetch("/api/admin/auth/2fa/regenerate-backup", { method: "POST" });
    const body = await res.json();
    if (body.ok) setBackupCodes(body.backupCodes);
  }

  async function revoke(id: string) {
    await apiFetch(`/api/admin/sessions/${id}/revoke`, { method: "POST" });
    await load();
  }

  async function logoutAll() {
    if (!confirm("Sign out of every device?")) return;
    await apiFetch("/api/admin/auth/logout-all", { method: "POST" });
    window.location.replace("/admin/login");
  }

  return (
    <div className="space-y-12 max-w-3xl">
      <section>
        <p className="label mb-3">// CHANGE PASSWORD</p>
        <form onSubmit={changePassword} className="space-y-4 max-w-md">
          <Field label="CURRENT" type="password" value={current} onChange={setCurrent} />
          <Field label="NEW" type="password" value={next} onChange={setNext} />
          {pwMsg && <p className="label">{pwMsg}</p>}
          <button
            type="submit"
            disabled={!current || !next}
            className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
          >
            Update password
          </button>
        </form>
      </section>

      <section>
        <p className="label mb-3">// 2FA</p>
        <p className="text-sm">Status: {totpEnabled ? "ENABLED" : "NOT YET CONFIGURED"}</p>
        {totpEnabled && (
          <button onClick={regenBackup} className="mt-4 label px-3 py-2 border border-charcoal hover:bg-charcoal hover:text-bone">
            REGENERATE BACKUP CODES →
          </button>
        )}
        {backupCodes && (
          <div className="mt-6 border border-charcoal p-6">
            <p className="label mb-3">// SAVE THESE NOW — SHOWN ONCE</p>
            <ul className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((c) => <li key={c} className="border border-line py-1 px-2">{c}</li>)}
            </ul>
          </div>
        )}
      </section>

      <section>
        <div className="flex items-baseline justify-between">
          <p className="label">// ACTIVE SESSIONS</p>
          <button onClick={logoutAll} className="label px-3 py-2 border border-line hover:border-charcoal">
            LOGOUT ALL →
          </button>
        </div>
        <div className="mt-4 border border-line">
          {sessions.length === 0 && <p className="label p-4 text-smoke">// NO SESSIONS.</p>}
          {sessions.map((s) => (
            <div key={s.id} className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] gap-4 p-3 border-t border-line text-sm first:border-t-0">
              <span className="font-mono">{s.ip_address || "—"}</span>
              <span className="font-mono text-xs text-smoke truncate">{s.user_agent || "—"}</span>
              <span className="label">{new Date(s.created_at).toLocaleString()}</span>
              <span className="label text-smoke">{s.revoked_at ? "REVOKED" : "ACTIVE"}</span>
              {!s.revoked_at && (
                <button onClick={() => revoke(s.id)} className="label hover:text-red-700">REVOKE</button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <p className="label mb-3">// AUDIT LOG — LAST 50</p>
        <div className="border border-line max-h-[500px] overflow-y-auto">
          {audit.map((a) => (
            <div key={a.id} className="grid grid-cols-[1fr_2fr_2fr_2fr] gap-2 p-2 border-t border-line text-xs first:border-t-0">
              <span className="label">{a.action.toUpperCase()}</span>
              <span className="font-mono text-smoke">{a.ip_address || "—"}</span>
              <span className="font-mono text-smoke truncate">{a.details ? JSON.stringify(a.details) : ""}</span>
              <span className="label text-smoke">{new Date(a.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, type }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="label block mb-2">{label}</span>
      <input
        type={type || "text"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
      />
    </label>
  );
}
