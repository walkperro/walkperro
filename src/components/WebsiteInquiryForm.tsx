"use client";

// Inquiry form on /websites/<slug>. POSTs to /api/websites-inquiry which
// fires a Resend email to walkperro@proton.me. Honeypot field `website` is
// hidden from real users; bots fill it and get silently dropped.

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  templateSlug: string;
  templateTitle: string;
};

const BUDGETS = [
  { value: "", label: "select a budget…" },
  { value: "<500", label: "under $500" },
  { value: "500-1500", label: "$500 – $1,500" },
  { value: "1500-5000", label: "$1,500 – $5,000" },
  { value: "5000+", label: "$5,000+" },
  { value: "not-sure", label: "not sure yet" },
];

export default function WebsiteInquiryForm({
  templateSlug,
  templateTitle,
}: Props) {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;
    setError(null);
    setState("loading");

    const fd = new FormData(e.currentTarget);
    const payload = {
      templateSlug,
      templateTitle,
      email: String(fd.get("email") || "").trim(),
      name: String(fd.get("name") || "").trim(),
      business: String(fd.get("business") || "").trim(),
      project: String(fd.get("project") || "").trim(),
      budget: String(fd.get("budget") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      website: String(fd.get("website") || "").trim(), // honeypot
    };

    try {
      const res = await fetch("/api/websites-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.ok !== true) {
        setError(body?.error || "send failed");
        setState("err");
        return;
      }
      setState("ok");
      (e.currentTarget as HTMLFormElement).reset();
    } catch {
      setError("network error");
      setState("err");
    }
  }

  if (state === "ok") {
    return (
      <div className="border border-charcoal bg-bone p-6 md:p-8">
        <p className="label mb-3">// inquiry received</p>
        <h2 className="font-display text-2xl md:text-3xl leading-tight">
          got it. i'll write you back within 24 hours.
        </h2>
        <p className="mt-4 text-charcoal/80">
          your inquiry for the <strong>{templateTitle}</strong> template is in
          my inbox. check yours — i'll reach out from walkperro.com.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-charcoal bg-bone p-6 md:p-8 flex flex-col gap-5"
    >
      <p className="label">// i want a website like this</p>
      <p className="text-charcoal/80 text-sm">
        you picked <strong>{templateTitle}</strong>. tell me about the business
        you want it for. only email is required — every other field helps me
        scope it faster.
      </p>

      {/* Honeypot — hidden from sighted users + screen readers */}
      <div className="hidden" aria-hidden="true">
        <label>
          leave blank
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Field label="EMAIL *" name="email" type="email" required placeholder="you@example.com" />
      <Field label="FIRST NAME" name="name" placeholder="walk" />
      <Field label="BUSINESS NAME" name="business" placeholder="walkperro studio" />

      <div className="flex flex-col gap-2">
        <label className="label" htmlFor="wif-project">// TELL ME ABOUT THE BUSINESS</label>
        <textarea
          id="wif-project"
          name="project"
          rows={4}
          placeholder="what does it do, who's it for, what do you want the site to do for it?"
          className="px-4 py-3 font-mono text-sm bg-transparent border border-charcoal text-charcoal placeholder:text-smoke focus:outline-none focus:border-charcoal"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="label" htmlFor="wif-budget">// BUDGET</label>
        <select
          id="wif-budget"
          name="budget"
          defaultValue=""
          className="px-4 py-3 font-mono text-sm bg-transparent border border-charcoal text-charcoal focus:outline-none focus:border-charcoal"
        >
          {BUDGETS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      <Field label="PHONE (OPTIONAL)" name="phone" type="tel" placeholder="optional — if you'd rather text" />

      <button
        type="submit"
        disabled={state === "loading"}
        className={cn(
          "self-start px-6 py-3 font-mono uppercase tracking-label text-[0.75rem] border transition-colors duration-snap ease-snap",
          state === "loading"
            ? "bg-charcoal/40 text-bone border-charcoal cursor-wait"
            : "bg-charcoal text-bone border-charcoal hover:bg-signal hover:text-charcoal"
        )}
      >
        {state === "loading" ? "SENDING…" : "SEND INQUIRY →"}
      </button>

      {state === "err" && (
        <p className="label text-charcoal">// {error || "try again"}</p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = `wif-${name}`;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="label">// {label}</label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={
          name === "email" ? "email" :
          name === "name" ? "given-name" :
          name === "business" ? "organization" :
          name === "phone" ? "tel" : "off"
        }
        className="px-4 py-3 font-mono text-sm bg-transparent border border-charcoal text-charcoal placeholder:text-smoke focus:outline-none focus:border-charcoal"
      />
    </div>
  );
}
