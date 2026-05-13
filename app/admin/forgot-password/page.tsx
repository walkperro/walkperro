"use client";

import { useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await apiFetch("/api/admin/auth/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bone text-charcoal flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <Link href="/admin/login" className="font-mono text-sm tracking-label lowercase block mb-10">
          ← back
        </Link>
        <p className="label mb-8">// PASSWORD — FORGOT</p>

        {!sent ? (
          <form onSubmit={submit} className="space-y-6">
            <label className="block">
              <span className="label block mb-2">EMAIL</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                autoComplete="email"
                className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
                required
              />
            </label>
            <button
              type="submit"
              disabled={loading || !email}
              className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
            >
              {loading ? "…" : "Send reset link"}
            </button>
          </form>
        ) : (
          <p className="label text-charcoal">// IF THAT EMAIL EXISTS, A RESET LINK IS ON ITS WAY.</p>
        )}
      </div>
    </main>
  );
}
