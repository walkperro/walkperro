"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api-fetch";

type Step = "password" | "totp";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin/subscribers";

  const [step, setStep] = useState<Step>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [lockMinutes, setLockMinutes] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  async function submitPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 423) {
        setLockMinutes(body.minutesRemaining || 15);
        setError("locked");
        return;
      }
      if (!res.ok) {
        setError(body.error || "invalid_credentials");
        return;
      }
      if (body.step === "totp") {
        setStep("totp");
      } else if (body.step === "setup-2fa") {
        router.replace("/admin/setup-2fa");
      } else {
        router.replace(next);
      }
    } finally {
      setLoading(false);
    }
  }

  async function submitTotp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch("/api/admin/auth/login-totp", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error || "invalid_code");
        return;
      }
      router.replace(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh bg-bone text-charcoal flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <Link href="/" className="font-mono text-sm tracking-label lowercase block mb-10">
          walkperro / admin
        </Link>
        <p className="label mb-8">// SIGN IN</p>

        {step === "password" && (
          <form onSubmit={submitPassword} className="space-y-6">
            <Field
              label="EMAIL"
              type="email"
              value={email}
              onChange={setEmail}
              autoFocus
              autoComplete="email"
            />
            <Field
              label="PASSWORD"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
            {error && (
              <p className="label text-red-700">
                {error === "locked"
                  ? `// ACCOUNT LOCKED. TRY AGAIN IN ${lockMinutes} MINUTES.`
                  : error === "rate_limited"
                  ? "// TOO MANY ATTEMPTS. WAIT 15 MINUTES."
                  : "// INVALID CREDENTIALS."}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
            >
              {loading ? "…" : "Sign in"}
            </button>
            <p className="label mt-6">
              <Link href="/admin/forgot-password" className="hover:underline">
                FORGOT PASSWORD →
              </Link>
            </p>
          </form>
        )}

        {step === "totp" && (
          <form onSubmit={submitTotp} className="space-y-6">
            <Field
              label="6-DIGIT CODE"
              value={code}
              onChange={setCode}
              autoFocus
              inputMode="numeric"
              maxLength={6}
              autoComplete="one-time-code"
            />
            {error && <p className="label text-red-700">// INVALID OR EXPIRED. TRY AGAIN.</p>}
            <button
              type="submit"
              disabled={loading || code.length < 6}
              className="inline-flex items-center font-mono uppercase tracking-label text-[0.75rem] px-5 py-3 border border-charcoal bg-charcoal text-bone hover:bg-signal hover:text-charcoal disabled:opacity-50"
            >
              {loading ? "…" : "Verify"}
            </button>
            <p className="label mt-6 text-smoke">// USE BACKUP CODE? PASTE IT IN THE FIELD ABOVE.</p>
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
  autoComplete?: string;
  inputMode?: "text" | "numeric";
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="label block mb-2">{props.label}</span>
      <input
        type={props.type || "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        autoFocus={props.autoFocus}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        maxLength={props.maxLength}
        className="w-full font-mono text-sm bg-transparent border-0 border-b border-charcoal py-2 focus:outline-none focus:border-b-2 focus:border-charcoal"
        required
      />
    </label>
  );
}
