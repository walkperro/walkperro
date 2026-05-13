"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";

type Post = {
  id?: string;
  slug?: string;
  title?: string;
  category?: string;
  excerpt?: string | null;
  body_md?: string;
  status?: string;
  scheduled_for?: string | null;
};

const CATEGORIES = ["BUILD LOG", "FIELD NOTE", "TOOL", "ESSAY"];
const STATUSES = ["draft", "scheduled", "published"];

export default function PostEditor({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: Post;
}) {
  const router = useRouter();
  const [post, setPost] = useState<Post>(initial || { status: "draft", category: "BUILD LOG" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof Post>(k: K, v: Post[K]) {
    setPost((p) => ({ ...p, [k]: v }));
  }

  async function save() {
    setError(null);
    setSaving(true);
    try {
      if (mode === "create") {
        const res = await apiFetch("/api/admin/posts", {
          method: "POST",
          body: JSON.stringify(post),
        });
        const body = await res.json();
        if (!res.ok) { setError(body.error || "save_failed"); return; }
        router.replace(`/admin/posts/${body.id}`);
      } else {
        const res = await apiFetch(`/api/admin/posts/${post.id}`, {
          method: "PUT",
          body: JSON.stringify(post),
        });
        const body = await res.json();
        if (!res.ok) { setError(body.error || "save_failed"); return; }
      }
    } finally {
      setSaving(false);
    }
  }

  async function del() {
    if (!post.id) return;
    if (!confirm("delete this post?")) return;
    const res = await apiFetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
    if (res.ok) router.replace("/admin/posts");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <Field label="TITLE" value={post.title || ""} onChange={(v) => set("title", v)} />
      <Field label="SLUG" value={post.slug || ""} onChange={(v) => set("slug", v)} placeholder="auto from title if blank" />
      <Select label="CATEGORY" value={post.category || "BUILD LOG"} onChange={(v) => set("category", v)} options={CATEGORIES} />
      <Field label="EXCERPT" value={post.excerpt || ""} onChange={(v) => set("excerpt", v)} />

      <label className="block">
        <span className="label block mb-2">BODY (MARKDOWN)</span>
        <textarea
          value={post.body_md || ""}
          onChange={(e) => set("body_md", e.target.value)}
          rows={24}
          className="w-full font-mono text-sm bg-transparent border border-line py-3 px-4 focus:outline-none focus:border-charcoal"
        />
      </label>

      <div className="grid grid-cols-2 gap-6">
        <Select label="STATUS" value={post.status || "draft"} onChange={(v) => set("status", v)} options={STATUSES} />
        <label className="block">
          <span className="label block mb-2">SCHEDULED FOR</span>
          <input
            type="datetime-local"
            value={
              post.scheduled_for ? new Date(post.scheduled_for).toISOString().slice(0, 16) : ""
            }
            onChange={(e) => set("scheduled_for", e.target.value ? new Date(e.target.value).toISOString() : null)}
            className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
          />
        </label>
      </div>

      {error && <p className="label text-red-700">// {error.toUpperCase()}</p>}

      <div className="flex items-center gap-3 pt-4">
        <button
          onClick={save}
          disabled={saving || !post.title}
          className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
        >
          {saving ? "…" : "Save"}
        </button>
        {mode === "edit" && post.slug && (
          <Link
            href={`/log/${post.slug}`}
            target="_blank"
            className="label px-3 py-2 border border-charcoal hover:bg-charcoal hover:text-bone"
          >
            PREVIEW →
          </Link>
        )}
        {mode === "edit" && (
          <button
            onClick={del}
            className="label px-3 py-2 border border-line text-smoke hover:border-red-700 hover:text-red-700 ml-auto"
          >
            DELETE
          </button>
        )}
      </div>
    </div>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="label block mb-2">{props.label}</span>
      <input
        type="text"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
      />
    </label>
  );
}

function Select(props: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="label block mb-2">{props.label}</span>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
      >
        {props.options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
