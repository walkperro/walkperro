"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

function LoginInner() {
  const params = useSearchParams();
  const next = params.get("next") || "/app/new";
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirectTo = () =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo() },
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: redirectTo() },
      });
      if (error) throw error;
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto w-full max-w-md px-6 py-28">
        <span className="label">// check your email</span>
        <h1 className="mt-5 font-display text-4xl leading-[1.0] tracking-[-0.02em]">
          the link is on its way.
        </h1>
        <p className="mt-5 text-smoke">
          we sent a sign-in link to{" "}
          <span className="font-mono text-charcoal">{email}</span>. open it on
          this device to keep going.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-8 font-mono text-xs uppercase tracking-[0.08em] text-smoke hover:text-charcoal"
        >
          ← use a different email
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-6 py-28">
      <div className="mb-5 flex items-center gap-3">
        <span className="inline-block h-2.5 w-2.5 bg-signal" aria-hidden />
        <span className="label">// sign in</span>
      </div>
      <h1 className="font-display text-4xl leading-[1.0] tracking-[-0.02em]">
        let&apos;s get you earning.
      </h1>

      <form onSubmit={sendLink} className="mt-10 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full border border-charcoal bg-transparent px-4 py-3.5 font-mono text-sm text-charcoal placeholder:text-smoke focus:outline-none focus:ring-1 focus:ring-charcoal"
          autoComplete="email"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full border border-charcoal bg-charcoal px-6 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-bone transition-colors duration-150 hover:enabled:bg-signal hover:enabled:text-charcoal disabled:opacity-40"
        >
          {busy ? "sending…" : "email me a sign-in link"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="hairline flex-1" />
        <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-smoke">
          or
        </span>
        <span className="hairline flex-1" />
      </div>

      <button
        onClick={google}
        className="w-full border border-charcoal bg-transparent px-6 py-3.5 font-mono text-xs uppercase tracking-[0.08em] text-charcoal transition-colors duration-150 hover:bg-charcoal hover:text-bone"
      >
        continue with google
      </button>

      {error && (
        <p className="mt-4 font-mono text-xs text-charcoal">{error}</p>
      )}
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bone text-charcoal">
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <a href="/" className="font-mono text-sm tracking-tight">
          walkperro
        </a>
        <span className="label">// for the ones who do</span>
      </header>
      <Suspense fallback={null}>
        <LoginInner />
      </Suspense>
    </main>
  );
}
