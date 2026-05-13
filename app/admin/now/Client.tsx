"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api-fetch";

type Now = { building: string | null; reading: string | null; listening: string | null };

export default function NowClient({ initial }: { initial: Now }) {
  const [val, setVal] = useState<Now>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await apiFetch("/api/admin/now", {
        method: "POST",
        body: JSON.stringify(val),
      });
      if (res.ok) setSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <p className="text-charcoal/80 mb-4">// THREE LINES. UPDATE WHENEVER. PUBLISHES IMMEDIATELY.</p>
      <Field label="// BUILDING" value={val.building || ""} onChange={(v) => setVal({ ...val, building: v })} />
      <Field label="// READING" value={val.reading || ""} onChange={(v) => setVal({ ...val, reading: v })} />
      <Field label="// LISTENING" value={val.listening || ""} onChange={(v) => setVal({ ...val, listening: v })} />
      <div className="flex items-center gap-3">
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
        >
          {saving ? "…" : "Publish"}
        </button>
        {saved && <span className="label text-charcoal">// LIVE.</span>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="label block mb-2">{label}</span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
      />
    </label>
  );
}
