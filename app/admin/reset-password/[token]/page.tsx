"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";

export default function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("mismatch");
      return;
    }
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/auth/reset", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(
          body.error === "weak_password"
            ? `weak (${(body.details || []).join(", ")})`
            : body.error || "failed"
        );
        return;
      }
      setDone(true);
      setTimeout(() => router.replace("/admin/login"), 1500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bone text-charcoal flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <p className="label mb-8">// PASSWORD — RESET</p>
        {done ? (
          <p className="label text-charcoal">// PASSWORD RESET. REDIRECTING TO SIGN IN…</p>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            <Field label="NEW PASSWORD" value={password} onChange={setPassword} type="password" autoFocus />
            <Field label="CONFIRM" value={confirm} onChange={setConfirm} type="password" />
            <p className="label text-smoke">// MIN 12 CHARS. UPPER + LOWER + DIGIT + SYMBOL.</p>
            {error && <p className="label text-red-700">// {error.toUpperCase()}</p>}
            <button
              type="submit"
              disabled={loading || !password || !confirm}
              className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
            >
              {loading ? "…" : "Set new password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="label block mb-2">{props.label}</span>
      <input
        type={props.type || "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoFocus={props.autoFocus}
        className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
        required
      />
    </label>
  );
}
