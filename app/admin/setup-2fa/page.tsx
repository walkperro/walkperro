"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-fetch";

export default function Setup2faPage() {
  const router = useRouter();
  const [qr, setQr] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await apiFetch("/api/admin/auth/2fa/setup-init", { method: "POST" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      const body = await res.json();
      if (body.qr) setQr(body.qr);
    })();
  }, [router]);

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/auth/2fa/setup-confirm", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      const body = await res.json();
      if (!res.ok) {
        setError("invalid_code");
        return;
      }
      setBackupCodes(body.backupCodes || []);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bone text-charcoal py-16">
      <div className="mx-auto max-w-2xl px-6">
        <p className="label">// SETUP — 2FA</p>
        <div className="hairline mt-3 mb-8" />
        <h1 className="font-display text-4xl leading-tight tracking-[-0.03em] mb-6">
          Lock your account.
        </h1>
        <p className="text-lg leading-relaxed text-charcoal/80 mb-10 max-w-prose">
          Scan the QR with Google Authenticator, Authy, or 1Password. Enter the
          6-digit code below to enable.
        </p>

        {!backupCodes && (
          <>
            {qr ? (
              <div className="bg-white border border-line p-6 inline-block mb-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="TOTP QR" width={220} height={220} />
              </div>
            ) : (
              <p className="label mb-8">// GENERATING…</p>
            )}

            <form onSubmit={confirm} className="space-y-6 max-w-sm">
              <label className="block">
                <span className="label block mb-2">6-DIGIT CODE</span>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  autoComplete="one-time-code"
                  className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2"
                  required
                />
              </label>
              {error && <p className="label text-red-700">// INVALID CODE. TRY AGAIN.</p>}
              <button
                type="submit"
                disabled={loading || code.length < 6}
                className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
              >
                {loading ? "…" : "Enable 2FA"}
              </button>
            </form>
          </>
        )}

        {backupCodes && (
          <div className="border border-charcoal p-8 max-w-xl">
            <p className="label mb-4 text-charcoal">// SAVE THESE NOW</p>
            <p className="text-charcoal/80 mb-6">
              Ten one-time backup codes. Each works exactly once if you ever lose
              your authenticator. Stash them in your password manager —{" "}
              <strong>this is the only time they&apos;ll be shown.</strong>
            </p>
            <ul className="grid grid-cols-2 gap-3 mb-8 font-mono text-sm">
              {backupCodes.map((c) => (
                <li key={c} className="border border-line py-2 px-3">
                  {c}
                </li>
              ))}
            </ul>
            <button
              onClick={() => router.replace("/admin/subscribers")}
              className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal"
            >
              I&apos;ve saved them — enter admin
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
