"use client";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-dvh bg-slate-50 text-slate-900">
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
            <p className="text-sm text-red-600">Something went wrong. Email me directly: <a className="underline" href="mailto:hello@walkperro.com">hello@walkperro.com</a></p>
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
            {/* IG icon */}
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
            {/* TikTok icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-700 group-hover:text-slate-900" fill="currentColor">
              <path d="M14 3c1.1 2.2 3 3.5 5 3.7V10c-1.9-.1-3.6-.8-5-2v6.8a6.8 6.8 0 1 1-2.5-5.3V12a3.8 3.8 0 1 0 1.5 3V3h1z"/>
            </svg>
          </a>
        </div>
      </div>
    </main>
  );
}
