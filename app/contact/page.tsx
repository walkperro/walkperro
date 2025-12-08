"use client";
import { useEffect, useState } from "react";

type Status = "idle" | "sending" | "sent" | "error" | "rate";

function Toast({ type, msg, onClose }: { type: "success" | "error"; msg: string; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 3500);
    return () => clearTimeout(id);
  }, [onClose]);
  return (
    <div className="fixed right-4 top-4 z-50">
      <div className={`rounded-xl px-4 py-3 shadow-lg border text-sm
        ${type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-red-50 border-red-200 text-red-900"}`}>
        {msg}
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      setStatus("sending");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 429) {
        setStatus("rate");
        setToast({ type: "error", msg: "Too many messages. Try again later." });
        return;
      }

      if (!res.ok) throw new Error("fail");
      setStatus("sent");
      setToast({ type: "success", msg: "Message sent. I’ll get back to you." });
      form.reset();
    } catch {
      setStatus("error");
      setToast({ type: "error", msg: "Something went wrong. Email hello@walkperro.com" });
    }
  }

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900">
      {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}

      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <header className="mb-10 flex items-center justify-between">
          <a href="/" className="text-sm text-slate-500 hover:text-slate-900">← Back home</a>
          <span className="text-xs uppercase tracking-widest text-slate-400">Work with me</span>
        </header>

        <h1 className="mb-6 text-3xl font-semibold tracking-tight">Work with me</h1>
        <p className="mb-8 text-slate-600">
          Tell me what you’re building and the outcome you want. I’ll reply with a tight plan.
        </p>

        <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* honeypot (bots fill this) */}
          <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

          <div>
            <label className="block text-xs font-medium text-slate-600">Name</label>
            <input name="name" required className="mt-1 w-full rounded-lg border border-slate-300 p-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Email</label>
            <input type="email" name="email" required className="mt-1 w-full rounded-lg border border-slate-300 p-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600">Project / Message</label>
            <textarea name="message" rows={6} required className="mt-1 w-full rounded-lg border border-slate-300 p-2 outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <button
            type="submit"
            disabled={status === "sending" || status === "sent"}
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent ✓" : "Send"}
          </button>

          {status === "error" && (
            <p className="text-sm text-red-600">Email me directly: <a className="underline" href="mailto:hello@walkperro.com">hello@walkperro.com</a></p>
          )}
          {status === "rate" && (
            <p className="text-sm text-orange-600">You’ve hit the limit. Try again in a bit.</p>
          )}
        </form>

        <div className="mt-8 flex items-center gap-4">
          <a
            href="https://instagram.com/walkperro"
            target="_blank" rel="noreferrer"
            aria-label="Instagram"
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white hover:border-slate-400"
            title="Instagram"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700 group-hover:text-slate-900" fill="currentColor">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm5.75-.75a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0z"/>
            </svg>
          </a>
          <a
            href="https://tiktok.com/@walkperro"
            target="_blank" rel="noreferrer"
            aria-label="TikTok"
            className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white hover:border-slate-400"
            title="TikTok"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700 group-hover:text-slate-900" fill="currentColor">
              <path d="M14 3c1.1 2.2 3 3.5 5 3.7V10c-1.9-.1-3.6-.8-5-2v6.8a6.8 6.8 0 1 1-2.5-5.3V12a3.8 3.8 0 1 0 1.5 3V3h1z"/>
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
