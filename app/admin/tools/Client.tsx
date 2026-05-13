"use client";

import { useState, useRef } from "react";
import { apiFetch } from "@/lib/api-fetch";

type Tool = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  url: string | null;
  file_path: string | null;
  price_cents: number;
  stripe_price_id: string | null;
  requires_email: boolean;
  sort_order: number;
  download_count: number;
};

const STATUSES = ["DRAFT", "PUBLIC", "LIVE", "BETA"];

export default function ToolsClient({ initial }: { initial: Tool[] }) {
  const [tools, setTools] = useState<Tool[]>(initial);

  async function update(id: string, patch: Partial<Tool>) {
    setTools((cur) => cur.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    await apiFetch(`/api/admin/tools/${id}`, {
      method: "PUT",
      body: JSON.stringify(patch),
    });
  }

  async function syncStripe(id: string) {
    const res = await apiFetch(`/api/admin/tools/${id}/sync-stripe`, { method: "POST" });
    const body = await res.json();
    if (body.ok && body.stripe_price_id) {
      setTools((cur) => cur.map((t) => (t.id === id ? { ...t, stripe_price_id: body.stripe_price_id } : t)));
    }
  }

  return (
    <div className="space-y-6">
      {tools.map((t) => (
        <ToolRow key={t.id} tool={t} onUpdate={update} onSyncStripe={syncStripe} />
      ))}
    </div>
  );
}

function ToolRow({
  tool,
  onUpdate,
  onSyncStripe,
}: {
  tool: Tool;
  onUpdate: (id: string, patch: Partial<Tool>) => void;
  onSyncStripe: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function upload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await apiFetch(`/api/admin/tools/${tool.id}/upload`, {
        method: "POST",
        body: fd,
      });
      const body = await res.json();
      if (body.ok) onUpdate(tool.id, { file_path: body.file_path });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="border border-line p-6">
      <div className="grid grid-cols-[2fr_1fr_1fr] gap-6 items-start">
        <div>
          <label className="block mb-3">
            <span className="label block mb-1">TITLE</span>
            <input
              type="text"
              defaultValue={tool.title}
              onBlur={(e) => e.target.value !== tool.title && onUpdate(tool.id, { title: e.target.value })}
              className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-1 focus:outline-none focus:border-b-2"
            />
          </label>
          <label className="block mb-3">
            <span className="label block mb-1">SLUG</span>
            <input
              type="text"
              defaultValue={tool.slug}
              onBlur={(e) => e.target.value !== tool.slug && onUpdate(tool.id, { slug: e.target.value })}
              className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-1 focus:outline-none focus:border-b-2"
            />
          </label>
          <label className="block">
            <span className="label block mb-1">DESCRIPTION</span>
            <textarea
              defaultValue={tool.description}
              rows={2}
              onBlur={(e) => e.target.value !== tool.description && onUpdate(tool.id, { description: e.target.value })}
              className="w-full font-mono text-sm bg-transparent border border-line py-2 px-3 focus:outline-none focus:border-charcoal"
            />
          </label>
        </div>
        <div>
          <label className="block mb-3">
            <span className="label block mb-1">STATUS</span>
            <select
              value={tool.status}
              onChange={(e) => onUpdate(tool.id, { status: e.target.value })}
              className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-1 focus:outline-none focus:border-b-2"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          <label className="block mb-3">
            <span className="label block mb-1">PRICE (CENTS)</span>
            <input
              type="number"
              defaultValue={tool.price_cents}
              onBlur={(e) => onUpdate(tool.id, { price_cents: Number(e.target.value) || 0 })}
              className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-1 focus:outline-none focus:border-b-2"
            />
          </label>
          <label className="block mb-3">
            <span className="label block mb-1">SORT ORDER</span>
            <input
              type="number"
              defaultValue={tool.sort_order}
              onBlur={(e) => onUpdate(tool.id, { sort_order: Number(e.target.value) || 0 })}
              className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-1 focus:outline-none focus:border-b-2"
            />
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={tool.requires_email}
              onChange={(e) => onUpdate(tool.id, { requires_email: e.target.checked })}
            />
            <span className="label">REQUIRES EMAIL</span>
          </label>
        </div>
        <div>
          <p className="label mb-2">FILE</p>
          {tool.file_path ? (
            <p className="font-mono text-sm break-all mb-2">{tool.file_path}</p>
          ) : (
            <p className="label text-smoke mb-2">// NO FILE UPLOADED</p>
          )}
          <input ref={fileRef} type="file" onChange={upload} className="hidden" />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="label px-3 py-2 border border-charcoal hover:bg-charcoal hover:text-bone disabled:opacity-50"
          >
            {uploading ? "UPLOADING…" : "UPLOAD FILE →"}
          </button>

          {tool.price_cents > 0 && (
            <div className="mt-4">
              <p className="label mb-2">STRIPE</p>
              {tool.stripe_price_id ? (
                <p className="font-mono text-xs break-all text-smoke">{tool.stripe_price_id}</p>
              ) : (
                <button
                  onClick={() => onSyncStripe(tool.id)}
                  className="label px-3 py-2 border border-charcoal hover:bg-charcoal hover:text-bone"
                >
                  SYNC PRICE →
                </button>
              )}
            </div>
          )}

          <p className="label mt-4 text-smoke">DOWNLOADS / {tool.download_count}</p>
        </div>
      </div>
    </div>
  );
}
