import { ingestLeadToLeadOps } from "@/lib/leadops";

export type WalkPerroMirrorInput = {
  walkperroLeadId?: string;
  createdAt?: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  website_url?: string | null;
  location?: string | null;
  message: string;
  intent: string;
  timeline: string;
  scope: string;
  growth_flags: string[];
  project_budget_range: string;
  monthly_marketing_spend_range: string;
  open_to_ads_if_roi_clear: boolean;
  monthly_revenue_range?: string | null;
  decision_maker: boolean;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  timezone?: string | null;
  score: number;
  priority: "low" | "medium" | "high";
  tags: string[];
};

function inferLeadType(scope: string) {
  const lower = scope.toLowerCase();
  if (lower.includes("portal") || lower.includes("admin")) return "dashboard-portal";
  if (lower.includes("booking") || lower.includes("inquiry")) return "website-build";
  if (lower.includes("website") || lower.includes("landing")) return "website-build";
  return "website-build";
}

export async function mirrorWalkPerroLeadToLeadOps(input: WalkPerroMirrorInput) {
  return ingestLeadToLeadOps(
    {
      source_project: "walkperro",
      source_channel: "website-form",
      source_name: "WalkPerro Homepage Flow",
      source_lead_id: input.walkperroLeadId || null,
      source_event_key: input.walkperroLeadId || null,
      idempotency_key: input.walkperroLeadId ? `walkperro:${input.walkperroLeadId}` : null,
      lead_type: inferLeadType(input.scope),
      contact_name: input.name,
      contact_email: input.email,
      contact_phone: input.phone || null,
      company: input.company || null,
      website_url: input.website_url || null,
      location: input.location || null,
      message: input.message,
      timezone: input.timezone || null,
      utm_source: input.utm_source || null,
      utm_medium: input.utm_medium || null,
      utm_campaign: input.utm_campaign || null,
      utm_term: input.utm_term || null,
      utm_content: input.utm_content || null,
      referrer: input.referrer || null,
      tags: input.tags,
      categories: ["website-form"],
      existing_score: input.score,
      priority: input.priority,
      score_version: "walkperro-v1",
      score_breakdown: {
        intent: input.intent,
        timeline: input.timeline,
        scope: input.scope,
        growth_flags: input.growth_flags,
        project_budget_range: input.project_budget_range,
        monthly_marketing_spend_range: input.monthly_marketing_spend_range,
        open_to_ads_if_roi_clear: input.open_to_ads_if_roi_clear,
        monthly_revenue_range: input.monthly_revenue_range || null,
        decision_maker: input.decision_maker,
        mirrored_from: "walkperro.leads",
      },
      normalized_payload: {
        intent: input.intent,
        timeline: input.timeline,
        scope: input.scope,
        growth_flags: input.growth_flags,
        project_budget_range: input.project_budget_range,
        monthly_marketing_spend_range: input.monthly_marketing_spend_range,
        open_to_ads_if_roi_clear: input.open_to_ads_if_roi_clear,
        monthly_revenue_range: input.monthly_revenue_range || null,
        decision_maker: input.decision_maker,
      },
      raw_payload: {
        source: "walkperro_homepage_flow",
      },
      score_profile: "walkperro-v1",
      spam_score: 0,
      spam_confidence: "low",
      spam_reasons: [],
    },
    "walkperro-system",
  );
}
