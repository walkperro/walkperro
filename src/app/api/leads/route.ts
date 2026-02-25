import { NextRequest, NextResponse } from "next/server";
import {
  GROWTH_FLAG_OPTIONS,
  INTENT_OPTIONS,
  MARKETING_SPEND_OPTIONS,
  MONTHLY_REVENUE_OPTIONS,
  PROJECT_BUDGET_OPTIONS,
  SCOPE_OPTIONS,
  TIMELINE_OPTIONS,
  scoreLead,
  type GrowthFlag,
  type LeadIntent,
  type LeadScope,
  type LeadTimeline,
  type MonthlyMarketingSpendRange,
  type MonthlyRevenueRange,
  type ProjectBudgetRange,
} from "@/lib/lead-scoring";
import { cleanupRateLimitStore, hitRateLimit } from "@/lib/rate-limit";
import { mirrorWalkPerroLeadToLeadOps } from "@/lib/leadops/walkperro-mirror";
import { getSupabaseServerConfig } from "@/lib/supabase-rest";

export const runtime = "nodejs";

type LeadPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  company?: unknown;
  website_url?: unknown;
  location?: unknown;
  message?: unknown;
  intent?: unknown;
  timeline?: unknown;
  scope?: unknown;
  growth_flags?: unknown;
  project_budget_range?: unknown;
  monthly_marketing_spend_range?: unknown;
  open_to_ads_if_roi_clear?: unknown;
  monthly_revenue_range?: unknown;
  decision_maker?: unknown;
  utm_source?: unknown;
  utm_medium?: unknown;
  utm_campaign?: unknown;
  utm_term?: unknown;
  utm_content?: unknown;
  referrer?: unknown;
  client_timezone?: unknown;
  website?: unknown; // honeypot
  turnstileToken?: unknown;
};

function toTrimmed(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toOptionalTrimmed(value: unknown): string | null {
  const v = toTrimmed(value);
  return v ? v : null;
}

function isOneOf<T extends string>(value: string, options: readonly T[]): value is T {
  return (options as readonly string[]).includes(value);
}

function uniqueStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item !== "string") continue;
    const trimmed = item.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    out.push(trimmed);
  }
  return out;
}

function getClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf;
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return "unknown";
}

async function verifyTurnstile(token: string, ip: string) {
  const secret =
    process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY ||
    process.env.TURNSTILE_SECRET_KEY ||
    process.env.CLOUDFLARE_API;
  if (!secret) {
    return { ok: false, reason: "Turnstile secret is not configured." };
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (ip && ip !== "unknown") body.set("remoteip", ip);

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });

  if (!res.ok) {
    return { ok: false, reason: `Turnstile verification failed (${res.status}).` };
  }

  const json = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
  if (!json.success) {
    return { ok: false, reason: json["error-codes"]?.join(", ") || "Turnstile rejected." };
  }

  return { ok: true as const };
}

async function insertLead(row: Record<string, unknown>) {
  const { supabaseUrl, serviceRoleKey } = getSupabaseServerConfig();

  const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: "return=representation",
      "Accept-Profile": "walkperro",
      "Content-Profile": "walkperro",
      Accept: "application/json",
    },
    body: JSON.stringify(row),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase insert failed (${res.status}): ${text}`);
  }

  const rows = (await res.json()) as Array<{ id: string; created_at: string }>;
  return rows[0];
}

function buildSubject(priority: string, score: number, scope: string, timeline: string) {
  if (priority === "high") return `🔥 HOT Lead (Score ${score}) — ${scope} — ${timeline}`;
  if (priority === "medium") return `New Lead (Score ${score}) — ${scope} — ${timeline}`;
  return `New Lead (Score ${score}) — ${scope}`;
}

async function sendResendEmail(args: {
  subject: string;
  body: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_SIGNUPS_TO;
  const from = process.env.RESEND_FROM;

  if (!apiKey || !to || !from) {
    throw new Error("Resend env vars are missing.");
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: args.subject,
      text: args.body,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend send failed (${res.status}): ${text}`);
  }
}

export async function POST(req: NextRequest) {
  cleanupRateLimitStore();

  let payload: LeadPayload;
  try {
    payload = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const honeypot = toTrimmed(payload.website);
  if (honeypot) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const ip = getClientIp(req);
  const rate = hitRateLimit(`lead:${ip}`, 5, 10 * 60 * 1000);
  if (rate.limited) {
    return NextResponse.json(
      { ok: false, error: "Too many submissions. Please wait a few minutes and try again." },
      { status: 429 },
    );
  }

  const turnstileToken = toTrimmed(payload.turnstileToken);
  if (!turnstileToken) {
    return NextResponse.json(
      { ok: false, error: "Spam protection check is required. Please try again." },
      { status: 400 },
    );
  }

  const turnstile = await verifyTurnstile(turnstileToken, ip);
  if (!turnstile.ok) {
    return NextResponse.json(
      { ok: false, error: "Could not verify your submission. Please refresh and try again." },
      { status: 400 },
    );
  }

  const name = toTrimmed(payload.name);
  const email = toTrimmed(payload.email).toLowerCase();
  const message = toTrimmed(payload.message);

  const intent = toTrimmed(payload.intent);
  const timeline = toTrimmed(payload.timeline);
  const scope = toTrimmed(payload.scope);
  const projectBudget = toTrimmed(payload.project_budget_range);
  const marketingSpend = toTrimmed(payload.monthly_marketing_spend_range);
  const monthlyRevenue = toTrimmed(payload.monthly_revenue_range);
  const growthFlags = uniqueStringArray(payload.growth_flags);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  if (!isOneOf(intent, INTENT_OPTIONS)) {
    return NextResponse.json({ ok: false, error: "Please choose a project goal." }, { status: 400 });
  }
  if (!isOneOf(timeline, TIMELINE_OPTIONS)) {
    return NextResponse.json({ ok: false, error: "Please choose a timeline." }, { status: 400 });
  }
  if (!isOneOf(scope, SCOPE_OPTIONS)) {
    return NextResponse.json({ ok: false, error: "Please choose a scope." }, { status: 400 });
  }
  if (!isOneOf(projectBudget, PROJECT_BUDGET_OPTIONS)) {
    return NextResponse.json({ ok: false, error: "Please choose a project budget." }, { status: 400 });
  }
  if (!isOneOf(marketingSpend, MARKETING_SPEND_OPTIONS)) {
    return NextResponse.json(
      { ok: false, error: "Please choose a monthly marketing spend range." },
      { status: 400 },
    );
  }

  const validatedGrowthFlags = growthFlags.filter((f): f is GrowthFlag =>
    isOneOf(f, GROWTH_FLAG_OPTIONS),
  );

  let validatedMonthlyRevenue: MonthlyRevenueRange | null = null;
  if (monthlyRevenue) {
    if (!isOneOf(monthlyRevenue, MONTHLY_REVENUE_OPTIONS)) {
      return NextResponse.json(
        { ok: false, error: "Current monthly revenue value is invalid." },
        { status: 400 },
      );
    }
    validatedMonthlyRevenue = monthlyRevenue;
  }

  const openToAds = payload.open_to_ads_if_roi_clear === true;
  const decisionMaker = payload.decision_maker === true;

  const scored = scoreLead({
    intent: intent as LeadIntent,
    timeline: timeline as LeadTimeline,
    scope: scope as LeadScope,
    growth_flags: validatedGrowthFlags,
    project_budget_range: projectBudget as ProjectBudgetRange,
    monthly_marketing_spend_range: marketingSpend as MonthlyMarketingSpendRange,
    open_to_ads_if_roi_clear: openToAds,
    decision_maker: decisionMaker,
  });

  const insertRow = {
    name,
    email,
    phone: toOptionalTrimmed(payload.phone),
    company: toOptionalTrimmed(payload.company),
    website_url: toOptionalTrimmed(payload.website_url),
    location: toOptionalTrimmed(payload.location),
    message,
    intent,
    timeline,
    scope,
    growth_flags: validatedGrowthFlags,
    project_budget_range: projectBudget,
    monthly_marketing_spend_range: marketingSpend,
    open_to_ads_if_roi_clear: openToAds,
    monthly_revenue_range: validatedMonthlyRevenue,
    decision_maker: decisionMaker,
    utm_source: toOptionalTrimmed(payload.utm_source),
    utm_medium: toOptionalTrimmed(payload.utm_medium),
    utm_campaign: toOptionalTrimmed(payload.utm_campaign),
    utm_term: toOptionalTrimmed(payload.utm_term),
    utm_content: toOptionalTrimmed(payload.utm_content),
    referrer: toOptionalTrimmed(payload.referrer),
    score: scored.score,
    priority: scored.priority,
    tags: scored.tags,
  };

  let inserted: { id: string; created_at: string } | undefined;
  try {
    inserted = await insertLead(insertRow);
  } catch (error) {
    console.error("[walkperro] lead insert failed", error);
    return NextResponse.json(
      { ok: false, error: "We couldn't save your request. Please try again in a moment." },
      { status: 500 },
    );
  }

  try {
    await mirrorWalkPerroLeadToLeadOps({
      walkperroLeadId: inserted?.id,
      createdAt: inserted?.created_at,
      name,
      email,
      phone: toOptionalTrimmed(payload.phone),
      company: toOptionalTrimmed(payload.company),
      website_url: toOptionalTrimmed(payload.website_url),
      location: toOptionalTrimmed(payload.location),
      message,
      intent,
      timeline,
      scope,
      growth_flags: validatedGrowthFlags,
      project_budget_range: projectBudget,
      monthly_marketing_spend_range: marketingSpend,
      open_to_ads_if_roi_clear: openToAds,
      monthly_revenue_range: validatedMonthlyRevenue,
      decision_maker: decisionMaker,
      utm_source: toOptionalTrimmed(payload.utm_source),
      utm_medium: toOptionalTrimmed(payload.utm_medium),
      utm_campaign: toOptionalTrimmed(payload.utm_campaign),
      utm_term: toOptionalTrimmed(payload.utm_term),
      utm_content: toOptionalTrimmed(payload.utm_content),
      referrer: toOptionalTrimmed(payload.referrer),
      timezone: toTrimmed(payload.client_timezone) || null,
      score: scored.score,
      priority: scored.priority,
      tags: scored.tags,
    });
  } catch (error) {
    console.error("[leadops] walkperro mirror failed", error);
  }

  const nowIso = new Date().toISOString();
  const emailBody = [
    `Lead ID: ${inserted?.id ?? "unknown"}`,
    `Created: ${inserted?.created_at ?? nowIso}`,
    `Received: ${nowIso}`,
    `Timezone: ${toTrimmed(payload.client_timezone) || "N/A"}`,
    "",
    `Score: ${scored.score}`,
    `Priority: ${scored.priority}`,
    `Tags: ${scored.tags.join(", ") || "none"}`,
    "",
    "Contact",
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${toTrimmed(payload.phone) || "N/A"}`,
    `Company: ${toTrimmed(payload.company) || "N/A"}`,
    `Website URL: ${toTrimmed(payload.website_url) || "N/A"}`,
    `Location: ${toTrimmed(payload.location) || "N/A"}`,
    `Decision maker: ${decisionMaker ? "Yes" : "No"}`,
    "",
    "Project",
    `Intent: ${intent}`,
    `Timeline: ${timeline}`,
    `Scope: ${scope}`,
    `Growth flags: ${validatedGrowthFlags.join(", ") || "None selected"}`,
    `Project budget: ${projectBudget}`,
    `Monthly marketing spend: ${marketingSpend}`,
    `Open to ads if ROI clear: ${openToAds ? "Yes" : "No"}`,
    `Current monthly revenue: ${validatedMonthlyRevenue || "N/A"}`,
    "",
    "Message",
    message,
    "",
    "Attribution",
    `Referrer: ${toTrimmed(payload.referrer) || "N/A"}`,
    `utm_source: ${toTrimmed(payload.utm_source) || "N/A"}`,
    `utm_medium: ${toTrimmed(payload.utm_medium) || "N/A"}`,
    `utm_campaign: ${toTrimmed(payload.utm_campaign) || "N/A"}`,
    `utm_term: ${toTrimmed(payload.utm_term) || "N/A"}`,
    `utm_content: ${toTrimmed(payload.utm_content) || "N/A"}`,
  ].join("\n");

  try {
    await sendResendEmail({
      subject: buildSubject(scored.priority, scored.score, scope, timeline),
      body: emailBody,
    });
  } catch (error) {
    console.error("[walkperro] lead email failed", error);
  }

  return NextResponse.json({ ok: true, id: inserted?.id, score: scored.score, priority: scored.priority });
}
