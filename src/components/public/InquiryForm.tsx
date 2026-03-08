"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import {
  INQUIRY_HELP_OPTIONS,
  INQUIRY_INVESTMENT_OPTIONS,
  INQUIRY_TIMELINE_OPTIONS,
  type InquiryHelpOption,
} from "@/lib/public-site";
import styles from "./site.module.css";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
        },
      ) => string | number;
      remove?: (widgetId: string | number) => void;
    };
  }
}

type InquiryState = {
  name: string;
  email: string;
  company: string;
  website_url: string;
  intent: InquiryHelpOption | "";
  project_budget_range: string;
  timeline: string;
  message: string;
  phone: string;
  referral_source: string;
  anything_else: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
  client_timezone: string;
  website: string;
  turnstileToken: string;
};

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ||
  process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY ||
  process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY ||
  "";

export default function InquiryForm({
  defaultIntent = "",
}: {
  defaultIntent?: InquiryHelpOption | "";
}) {
  const [form, setForm] = useState<InquiryState>({
    name: "",
    email: "",
    company: "",
    website_url: "",
    intent: defaultIntent,
    project_budget_range: "",
    timeline: "",
    message: "",
    phone: "",
    referral_source: "",
    anything_else: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
    referrer: "",
    client_timezone: "",
    website: "",
    turnstileToken: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [scriptReady, setScriptReady] = useState(false);
  const [turnstileError, setTurnstileError] = useState("");
  const turnstileRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setForm((prev) => ({
      ...prev,
      utm_source: params.get("utm_source") || "",
      utm_medium: params.get("utm_medium") || "",
      utm_campaign: params.get("utm_campaign") || "",
      utm_term: params.get("utm_term") || "",
      utm_content: params.get("utm_content") || "",
      referrer: document.referrer || "",
      client_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    }));
  }, []);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || !scriptReady || !turnstileRef.current) return;

    let cancelled = false;
    let retries = 0;
    let retryTimer: number | null = null;

    const mountTurnstile = () => {
      if (cancelled) return;
      const api = window.turnstile;
      if (!api) {
        retries += 1;
        if (retries < 10) {
          retryTimer = window.setTimeout(mountTurnstile, 350);
          return;
        }
        setTurnstileError("Spam protection could not initialize. Refresh and try again.");
        return;
      }

      if (widgetIdRef.current != null && api.remove) {
        try {
          api.remove(widgetIdRef.current);
        } catch {
          // ignore stale widget removal errors
        }
        widgetIdRef.current = null;
      }

      setTurnstileError("");
      const mountNode = turnstileRef.current;
      if (!mountNode) return;

      widgetIdRef.current = api.render(mountNode, {
        sitekey: TURNSTILE_SITE_KEY,
        theme: "light",
        callback: (token) => setForm((prev) => ({ ...prev, turnstileToken: token })),
        "expired-callback": () => setForm((prev) => ({ ...prev, turnstileToken: "" })),
      });
    };

    mountTurnstile();

    return () => {
      cancelled = true;
      if (retryTimer != null) window.clearTimeout(retryTimer);
    };
  }, [scriptReady]);

  function updateField<K extends keyof InquiryState>(key: K, value: InquiryState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function validate() {
    if (!form.name.trim()) return "Name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Enter a valid email address.";
    if (!form.company.trim()) return "Company or brand is required.";
    if (!form.website_url.trim()) return "A website or social link is required.";
    if (!form.intent) return "Select what you need help with.";
    if (!form.project_budget_range) return "Select an estimated investment.";
    if (!form.timeline) return "Select your timeline.";
    if (!form.message.trim()) return "A short project brief is required.";
    if (!TURNSTILE_SITE_KEY) return "Turnstile site key is missing. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY.";
    if (!form.turnstileToken) return "Complete the spam protection check before submitting.";
    return "";
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate();
    if (validation) {
      setError(validation);
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          website_url: form.website_url.trim(),
          message: form.message.trim(),
          phone: form.phone.trim(),
          referral_source: form.referral_source.trim(),
          anything_else: form.anything_else.trim(),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error || "Could not submit right now. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className={styles.inquiryPanel}>
        <div className={styles.success}>
          <p className={styles.eyebrow}>Inquiry received</p>
          <h3 className={styles.heading}>Thanks. We’ll review your inquiry and reply with next steps.</h3>
          <p className={styles.successText}>
            Expect a response within 1–2 business days. If your project is time-sensitive, mention that in your brief and we’ll prioritize accordingly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.inquiryPanel}>
      {TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
          onLoad={() => setScriptReady(true)}
        />
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGrid}>
          <div className={styles.field}>
            <label htmlFor="name">Name</label>
            <input id="name" className={styles.input} value={form.name} onChange={(e) => updateField("name", e.target.value)} autoComplete="name" />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email</label>
            <input id="email" className={styles.input} type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} autoComplete="email" />
          </div>

          <div className={styles.field}>
            <label htmlFor="company">Company / Brand</label>
            <input id="company" className={styles.input} value={form.company} onChange={(e) => updateField("company", e.target.value)} autoComplete="organization" />
          </div>

          <div className={styles.field}>
            <label htmlFor="website_url">Website or Social Link</label>
            <input id="website_url" className={styles.input} value={form.website_url} onChange={(e) => updateField("website_url", e.target.value)} placeholder="website.com or instagram.com/yourbrand" />
          </div>

          <div className={styles.field}>
            <label htmlFor="intent">What do you need help with?</label>
            <select id="intent" className={styles.select} value={form.intent} onChange={(e) => updateField("intent", e.target.value as InquiryHelpOption | "") }>
              <option value="">Select one</option>
              {INQUIRY_HELP_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="budget">Estimated Investment</label>
            <select id="budget" className={styles.select} value={form.project_budget_range} onChange={(e) => updateField("project_budget_range", e.target.value)}>
              <option value="">Select one</option>
              {INQUIRY_INVESTMENT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="timeline">Timeline</label>
            <select id="timeline" className={styles.select} value={form.timeline} onChange={(e) => updateField("timeline", e.target.value)}>
              <option value="">Select one</option>
              {INQUIRY_TIMELINE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="phone">Phone (optional)</label>
            <input id="phone" className={styles.input} value={form.phone} onChange={(e) => updateField("phone", e.target.value)} autoComplete="tel" />
          </div>

          <div className={styles.fieldSpan}>
            <label htmlFor="message">Short Project Brief</label>
            <textarea id="message" className={styles.textarea} value={form.message} onChange={(e) => updateField("message", e.target.value)} placeholder="Tell us what you want built, refined, or automated." />
          </div>

          <div className={styles.field}>
            <label htmlFor="referral_source">Referral Source (optional)</label>
            <input id="referral_source" className={styles.input} value={form.referral_source} onChange={(e) => updateField("referral_source", e.target.value)} placeholder="Friend, Instagram, Google, referral..." />
          </div>

          <div className={styles.field}>
            <label htmlFor="anything_else">Anything Else We Should Know? (optional)</label>
            <input id="anything_else" className={styles.input} value={form.anything_else} onChange={(e) => updateField("anything_else", e.target.value)} />
          </div>
        </div>

        <input
          className={styles.input}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          name="website"
          value={form.website}
          onChange={(e) => updateField("website", e.target.value)}
        />

        <div ref={turnstileRef} />
        {turnstileError ? <p className={styles.error}>{turnstileError}</p> : null}
        {error ? <p className={styles.error}>{error}</p> : null}

        <button className={styles.buttonPrimary} type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send inquiry"}
        </button>

        <p className={styles.legal}>Please do not submit HIPAA, PHI, or other sensitive personal information through this form.</p>
      </form>
    </div>
  );
}
