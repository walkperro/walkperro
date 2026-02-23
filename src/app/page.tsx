"use client";

import Link from "next/link";
import Script from "next/script";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import PerroPngMark from "@/components/PerroPngMark";
import {
  GROWTH_FLAG_OPTIONS,
  INTENT_OPTIONS,
  MARKETING_SPEND_OPTIONS,
  MONTHLY_REVENUE_OPTIONS,
  PROJECT_BUDGET_OPTIONS,
  SCOPE_OPTIONS,
  TIMELINE_OPTIONS,
  type GrowthFlag,
  type LeadIntent,
  type LeadScope,
  type LeadTimeline,
  type MonthlyMarketingSpendRange,
  type MonthlyRevenueRange,
  type ProjectBudgetRange,
} from "@/lib/lead-scoring";

declare global {
  interface Window {
    onWalkPerroTurnstileSuccess?: (token: string) => void;
    onWalkPerroTurnstileExpired?: () => void;
  }
}

type FormState = {
  intent: LeadIntent | "";
  timeline: LeadTimeline | "";
  scope: LeadScope | "";
  growth_flags: GrowthFlag[];
  project_budget_range: ProjectBudgetRange | "";
  monthly_marketing_spend_range: MonthlyMarketingSpendRange | "";
  open_to_ads_if_roi_clear: boolean;
  monthly_revenue_range: MonthlyRevenueRange | "";
  message: string;
  website_url: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  location: string;
  decision_maker: boolean;
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

const TOTAL_STEPS = 6;
const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "";

function stepTitle(step: number) {
  switch (step) {
    case 0:
      return "What do you want help with?";
    case 1:
      return "How soon are you trying to move?";
    case 2:
      return "What scope fits best right now?";
    case 3:
      return "What growth pieces do you want included?";
    case 4:
      return "Budget and qualification";
    default:
      return "Final details";
  }
}

export default function HomePage() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<null | { score?: number; priority?: string }>(null);
  const [form, setForm] = useState<FormState>({
    intent: "",
    timeline: "",
    scope: "",
    growth_flags: [],
    project_budget_range: "",
    monthly_marketing_spend_range: "",
    open_to_ads_if_roi_clear: false,
    monthly_revenue_range: "",
    message: "",
    website_url: "",
    name: "",
    email: "",
    company: "",
    phone: "",
    location: "",
    decision_maker: false,
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

  const flowRef = useRef<HTMLDivElement | null>(null);

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
    window.onWalkPerroTurnstileSuccess = (token: string) => {
      setForm((prev) => ({ ...prev, turnstileToken: token }));
      setSubmitError("");
    };
    window.onWalkPerroTurnstileExpired = () => {
      setForm((prev) => ({ ...prev, turnstileToken: "" }));
    };

    return () => {
      delete window.onWalkPerroTurnstileSuccess;
      delete window.onWalkPerroTurnstileExpired;
    };
  }, []);

  const summaryChips = useMemo(() => {
    const chips: string[] = [];
    if (form.intent) chips.push(form.intent);
    if (form.timeline) chips.push(form.timeline);
    if (form.scope) chips.push(form.scope);
    if (form.growth_flags.length) chips.push(`${form.growth_flags.length} growth items`);
    if (form.project_budget_range) chips.push(form.project_budget_range);
    return chips;
  }, [form]);

  function scrollToFlow() {
    flowRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function chooseSingle<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError("");
  }

  function toggleGrowthFlag(flag: GrowthFlag) {
    setForm((prev) => {
      const has = prev.growth_flags.includes(flag);
      return {
        ...prev,
        growth_flags: has ? prev.growth_flags.filter((f) => f !== flag) : [...prev.growth_flags, flag],
      };
    });
  }

  function validateStep(currentStep: number) {
    if (currentStep === 0 && !form.intent) return "Select the main goal for this project.";
    if (currentStep === 1 && !form.timeline) return "Select your preferred timeline.";
    if (currentStep === 2 && !form.scope) return "Select the project scope.";
    if (currentStep === 4) {
      if (!form.project_budget_range) return "Select your project budget range.";
      if (!form.monthly_marketing_spend_range) return "Select your monthly marketing spend range.";
    }
    if (currentStep === 5) {
      if (!form.message.trim()) return "Project details are required.";
      if (!form.name.trim()) return "Name is required.";
      if (!form.email.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return "Enter a valid email address.";
      if (!TURNSTILE_SITE_KEY) return "Turnstile site key is missing. Add NEXT_PUBLIC_TURNSTILE_SITE_KEY.";
      if (!form.turnstileToken) return "Complete the spam protection check before submitting.";
    }
    return "";
  }

  function nextStep() {
    const message = validateStep(step);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStep((prev) => Math.min(TOTAL_STEPS - 1, prev + 1));
    scrollToFlow();
  }

  function prevStep() {
    setError("");
    setSubmitError("");
    setStep((prev) => Math.max(0, prev - 1));
    scrollToFlow();
  }

  async function handleSubmit() {
    const validationMessage = validateStep(5);
    if (validationMessage) {
      setSubmitError(validationMessage);
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          email: form.email.trim(),
          company: form.company.trim(),
          phone: form.phone.trim(),
          location: form.location.trim(),
          website_url: form.website_url.trim(),
          message: form.message.trim(),
        }),
      });

      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        score?: number;
        priority?: string;
      };

      if (!res.ok || !json.ok) {
        setSubmitError(json.error || "Could not submit right now. Please try again.");
        return;
      }

      setSubmitted({ score: json.score, priority: json.priority });
      setStep(TOTAL_STEPS);
      scrollToFlow();
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const progressStep = Math.min(step + 1, TOTAL_STEPS);

  return (
    <main className="wpLeadFlow">
      {TURNSTILE_SITE_KEY ? (
        <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />
      ) : null}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "WalkPerro",
              url: "https://walkperro.com",
              logo: "https://walkperro.com/perro/white_perro_v2.png",
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "WalkPerro",
              url: "https://walkperro.com",
            },
          ]),
        }}
      />

      <section className="wpHero">
        <div className="wpHeroGlow" aria-hidden="true" />
        <div className="wpHeroInner">
          <div className="wpHeroBrand">
            <div className="wpHeroTitleRow">
              <h1 className="wpHeroTitle">WalkPerro</h1>
              <PerroPngMark variant="white" className="wpHeroMark" />
            </div>
            <p className="wpHeroHeadline">Websites + conversion systems for service businesses.</p>
            <p className="wpHeroSubhead">
              Launch fast. Track what matters. Turn traffic into booked calls.
            </p>
          </div>

          <div className="wpHeroActions">
            <button className="wpBtnPrimary" type="button" onClick={scrollToFlow}>
              Get a fast quote (60 seconds)
            </button>
            <Link className="wpBtnSecondary" href="/services">
              See work
            </Link>
          </div>

          <div className="wpHeroProof" aria-label="Why WalkPerro">
            <div className="wpHeroProofItem">
              <strong>Fast launch</strong>
              <span>Conversion-ready pages and tracking</span>
            </div>
            <div className="wpHeroProofItem">
              <strong>Qualified pipeline</strong>
              <span>Lead capture focused on buying intent</span>
            </div>
            <div className="wpHeroProofItem">
              <strong>Measurement built-in</strong>
              <span>SEO, GA4, ads tracking, follow-up options</span>
            </div>
          </div>
        </div>
      </section>

      <section className="wpFlowSection" id="fast-quote" ref={flowRef}>
        <div className="wpFlowCard">
          {step < TOTAL_STEPS ? (
            <>
              <div className="wpFlowHeader">
                <div>
                  <p className="wpFlowKicker">Fast quote</p>
                  <h2 className="wpFlowTitle">{stepTitle(step)}</h2>
                </div>
                <p className="wpFlowProgressText">
                  {progressStep}/{TOTAL_STEPS}
                </p>
              </div>
              <div className="wpFlowProgressBar" aria-hidden="true">
                <span style={{ width: `${(progressStep / TOTAL_STEPS) * 100}%` }} />
              </div>

              {summaryChips.length ? (
                <div className="wpFlowSummary" aria-label="Selections so far">
                  {summaryChips.map((chip) => (
                    <span key={chip} className="wpChipMuted">
                      {chip}
                    </span>
                  ))}
                </div>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="wpStepBody"
                >
                  {step === 0 ? (
                    <SingleSelectGrid
                      options={INTENT_OPTIONS}
                      value={form.intent}
                      onPick={(value) => chooseSingle("intent", value)}
                    />
                  ) : null}

                  {step === 1 ? (
                    <SingleSelectGrid
                      options={TIMELINE_OPTIONS}
                      value={form.timeline}
                      onPick={(value) => chooseSingle("timeline", value)}
                    />
                  ) : null}

                  {step === 2 ? (
                    <SingleSelectGrid
                      options={SCOPE_OPTIONS}
                      value={form.scope}
                      onPick={(value) => chooseSingle("scope", value)}
                    />
                  ) : null}

                  {step === 3 ? (
                    <div className="wpMultiGrid">
                      {GROWTH_FLAG_OPTIONS.map((option) => {
                        const active = form.growth_flags.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            className={active ? "wpChoice wpChoiceActive" : "wpChoice"}
                            onClick={() => toggleGrowthFlag(option)}
                            aria-pressed={active}
                          >
                            {option}
                          </button>
                        );
                      })}
                      <p className="wpHint">Optional. Pick any that matter now.</p>
                    </div>
                  ) : null}

                  {step === 4 ? (
                    <div className="wpFormStack">
                      <FieldGroup label="Project budget range" required>
                        <SingleSelectGrid
                          options={PROJECT_BUDGET_OPTIONS}
                          value={form.project_budget_range}
                          onPick={(value) => chooseSingle("project_budget_range", value)}
                        />
                      </FieldGroup>

                      <FieldGroup label="Monthly marketing spend" required>
                        <SingleSelectGrid
                          options={MARKETING_SPEND_OPTIONS}
                          value={form.monthly_marketing_spend_range}
                          onPick={(value) => chooseSingle("monthly_marketing_spend_range", value)}
                        />
                      </FieldGroup>

                      <label className="wpToggleRow">
                        <input
                          type="checkbox"
                          checked={form.open_to_ads_if_roi_clear}
                          onChange={(e) => chooseSingle("open_to_ads_if_roi_clear", e.target.checked)}
                        />
                        <span>Open to ads if ROI is clear</span>
                      </label>

                      <FieldGroup label="Current monthly revenue (optional)">
                        <SingleSelectGrid
                          options={MONTHLY_REVENUE_OPTIONS}
                          value={form.monthly_revenue_range}
                          onPick={(value) => chooseSingle("monthly_revenue_range", value)}
                          allowClear
                        />
                      </FieldGroup>
                    </div>
                  ) : null}

                  {step === 5 ? (
                    <div className="wpFormStack">
                      <label className="wpLabel">
                        <span>Project details / message *</span>
                        <textarea
                          className="wpInput wpTextarea"
                          rows={5}
                          value={form.message}
                          onChange={(e) => chooseSingle("message", e.target.value)}
                          placeholder="What do you need built or fixed? What outcome are you after?"
                        />
                      </label>

                      <div className="wpGridTwo">
                        <label className="wpLabel">
                          <span>Name *</span>
                          <input
                            className="wpInput"
                            value={form.name}
                            onChange={(e) => chooseSingle("name", e.target.value)}
                            autoComplete="name"
                          />
                        </label>
                        <label className="wpLabel">
                          <span>Email *</span>
                          <input
                            className="wpInput"
                            type="email"
                            value={form.email}
                            onChange={(e) => chooseSingle("email", e.target.value)}
                            autoComplete="email"
                          />
                        </label>
                      </div>

                      <div className="wpGridTwo">
                        <label className="wpLabel">
                          <span>Website URL (recommended)</span>
                          <input
                            className="wpInput"
                            type="url"
                            value={form.website_url}
                            onChange={(e) => chooseSingle("website_url", e.target.value)}
                            placeholder="https://..."
                          />
                        </label>
                        <label className="wpLabel">
                          <span>Company</span>
                          <input
                            className="wpInput"
                            value={form.company}
                            onChange={(e) => chooseSingle("company", e.target.value)}
                            autoComplete="organization"
                          />
                        </label>
                      </div>

                      <div className="wpGridTwo">
                        <label className="wpLabel">
                          <span>Phone</span>
                          <input
                            className="wpInput"
                            type="tel"
                            value={form.phone}
                            onChange={(e) => chooseSingle("phone", e.target.value)}
                            autoComplete="tel"
                          />
                        </label>
                        <label className="wpLabel">
                          <span>Location (city/state)</span>
                          <input
                            className="wpInput"
                            value={form.location}
                            onChange={(e) => chooseSingle("location", e.target.value)}
                            placeholder="Austin, TX"
                          />
                        </label>
                      </div>

                      <label className="wpToggleRow">
                        <input
                          type="checkbox"
                          checked={form.decision_maker}
                          onChange={(e) => chooseSingle("decision_maker", e.target.checked)}
                        />
                        <span>I’m a decision maker for this project</span>
                      </label>

                      <input
                        className="wpHp"
                        tabIndex={-1}
                        autoComplete="off"
                        value={form.website}
                        onChange={(e) => chooseSingle("website", e.target.value)}
                        name="website"
                        aria-hidden="true"
                      />

                      <div className="wpTurnstileWrap">
                        {TURNSTILE_SITE_KEY ? (
                          <div
                            className="cf-turnstile"
                            data-sitekey={TURNSTILE_SITE_KEY}
                            data-theme="dark"
                            data-callback="onWalkPerroTurnstileSuccess"
                            data-expired-callback="onWalkPerroTurnstileExpired"
                          />
                        ) : (
                          <p className="wpError">
                            Turnstile site key missing. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY` to enable submissions.
                          </p>
                        )}
                      </div>

                      {submitError ? <p className="wpError">{submitError}</p> : null}
                    </div>
                  ) : null}
                </motion.div>
              </AnimatePresence>

              {error ? <p className="wpError">{error}</p> : null}

              <div className="wpFlowFooter">
                <button type="button" className="wpBtnGhost" onClick={prevStep} disabled={step === 0}>
                  Back
                </button>
                {step < TOTAL_STEPS - 1 ? (
                  <button type="button" className="wpBtnPrimary" onClick={nextStep}>
                    Continue
                  </button>
                ) : (
                  <button type="button" className="wpBtnPrimary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Sending..." : "Send quote request"}
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="wpSuccess">
              <p className="wpFlowKicker">Submitted</p>
              <h2 className="wpFlowTitle">Thanks. We’ve got your request.</h2>
              <p className="wpSuccessText">
                We’ll review your answers and reply with next steps. Your request was captured and prioritized.
              </p>
              {submitted ? (
                <div className="wpSuccessMeta">
                  <span className="wpChipMuted">Score: {submitted.score ?? "-"}</span>
                  <span className="wpChipMuted">Priority: {submitted.priority ?? "-"}</span>
                </div>
              ) : null}
              <div className="wpHeroActions">
                <button className="wpBtnGhost" type="button" onClick={() => setStep(0)}>
                  Start another quote
                </button>
                <Link className="wpBtnSecondary" href="/services">
                  See work
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="wpFieldGroup">
      <p className="wpFieldLabel">
        {label}
        {required ? " *" : ""}
      </p>
      {children}
    </div>
  );
}

function SingleSelectGrid<T extends string>({
  options,
  value,
  onPick,
  allowClear = false,
}: {
  options: readonly T[];
  value: T | "";
  onPick: (value: T | "") => void;
  allowClear?: boolean;
}) {
  return (
    <div className="wpChoiceGrid">
      {options.map((option) => {
        const active = value === option;
        return (
          <button
            key={option}
            type="button"
            className={active ? "wpChoice wpChoiceActive" : "wpChoice"}
            onClick={() => onPick(option)}
            aria-pressed={active}
          >
            {option}
          </button>
        );
      })}
      {allowClear && value ? (
        <button type="button" className="wpBtnGhost wpClearBtn" onClick={() => onPick("")}>Clear</button>
      ) : null}
    </div>
  );
}
