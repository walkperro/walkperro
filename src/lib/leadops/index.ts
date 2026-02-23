import { supabaseRestRequest } from "@/lib/supabase-rest";
import { scoreGenericLead, type LeadOpsPriority } from "@/lib/leadops/scoring";

export type LeadOpsLead = {
  id: string;
  created_at: string;
  updated_at: string;
  source_project: string;
  source_channel: string;
  source_name: string | null;
  source_id: string | null;
  source_lead_id: string | null;
  source_event_key: string | null;
  idempotency_key: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  company: string | null;
  website_url: string | null;
  location: string | null;
  message: string | null;
  lead_type: string | null;
  industry: string | null;
  subindustry: string | null;
  tags: string[];
  normalized_payload: Record<string, unknown>;
  raw_payload: Record<string, unknown>;
  score: number;
  score_version: string;
  score_breakdown: Record<string, unknown>;
  priority: LeadOpsPriority;
  status: string;
  stage: string;
  owner: string | null;
  assignee: string | null;
  follow_up_at: string | null;
  first_contacted_at: string | null;
  last_contacted_at: string | null;
  classification_reviewed_at: string | null;
  classification_review: string | null;
  classification_reviewer: string | null;
  classification_review_notes: string | null;
  spam_score: number;
  spam_confidence: "low" | "medium" | "high";
  spam_reasons: string[];
  merged_into_lead_id: string | null;
  duplicate_group_key: string | null;
  dedupe_hints: string[];
  enrichment_status: string;
  enrichment_notes: string | null;
  timezone: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  internal_notes: string | null;
};

export type LeadOpsCategory = {
  id: string;
  kind: string;
  slug: string;
  label: string;
  color: string | null;
  active: boolean;
  sort_order: number;
  description: string | null;
};

export type LeadOpsSource = {
  id: string;
  source_project: string;
  source_channel: string;
  source_key: string;
  display_name: string;
  scoring_profile: string;
  last_seen_at: string | null;
  health_status: string;
};

export type LeadOpsSavedView = {
  id: string;
  name: string;
  slug: string;
  owner: string | null;
  filters: Record<string, unknown>;
  sort_order: number;
  pinned: boolean;
  active: boolean;
};

export type LeadOpsIngestInput = {
  source_project: string;
  source_channel: string;
  source_name?: string | null;
  source_lead_id?: string | null;
  source_event_key?: string | null;
  idempotency_key?: string | null;
  lead_type?: string | null;
  industry?: string | null;
  subindustry?: string | null;
  contact_name?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  company?: string | null;
  website_url?: string | null;
  location?: string | null;
  message?: string | null;
  timezone?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_term?: string | null;
  utm_content?: string | null;
  referrer?: string | null;
  normalized_payload?: Record<string, unknown>;
  raw_payload?: Record<string, unknown>;
  tags?: string[];
  categories?: string[]; // category slugs
  existing_score?: number | null;
  score_version?: string | null;
  score_breakdown?: Record<string, unknown> | null;
  priority?: LeadOpsPriority | null;
  spam_score?: number | null;
  spam_confidence?: "low" | "medium" | "high" | null;
  spam_reasons?: string[] | null;
  score_profile?: string | null;
};

function s(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullable(value: unknown) {
  const v = s(value);
  return v || null;
}

function uniqueStrings(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of value) {
    if (typeof item !== "string") continue;
    const v = item.trim();
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

export function actorFromBasicAuth(header: string | null): string {
  if (!header?.startsWith("Basic ")) return "admin";
  try {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const [user] = decoded.split(":");
    return user || "admin";
  } catch {
    return "admin";
  }
}

export async function ensureSource(args: {
  source_project: string;
  source_channel: string;
  source_name?: string | null;
  score_profile?: string | null;
}) {
  const sourceKey = `${args.source_project}:${args.source_channel}`;
  const existing = await supabaseRestRequest<LeadOpsSource[]>({
    schema: "leadops",
    path: `sources?select=id,source_project,source_channel,source_key,display_name,scoring_profile,last_seen_at,health_status&source_key=eq.${encodeURIComponent(sourceKey)}&limit=1`,
  });

  if (existing[0]) {
    await supabaseRestRequest({
      schema: "leadops",
      method: "PATCH",
      path: `sources?source_key=eq.${encodeURIComponent(sourceKey)}`,
      body: {
        updated_at: new Date().toISOString(),
        last_seen_at: new Date().toISOString(),
        health_status: "healthy",
        ...(args.source_name ? { display_name: args.source_name } : {}),
      },
      prefer: "return=minimal",
    });
    return existing[0];
  }

  const inserted = await supabaseRestRequest<LeadOpsSource[]>({
    schema: "leadops",
    method: "POST",
    path: "sources",
    body: {
      source_project: args.source_project,
      source_channel: args.source_channel,
      source_key: sourceKey,
      display_name: args.source_name || sourceKey,
      scoring_profile: args.score_profile || "generic-v1",
      source_kind: "website-form",
      last_seen_at: new Date().toISOString(),
      health_status: "healthy",
    },
  });

  return inserted[0];
}

export async function logLeadActivity(leadId: string | null, action: string, actor: string, detail: Record<string, unknown>) {
  await supabaseRestRequest({
    schema: "leadops",
    method: "POST",
    path: "lead_activities",
    body: { lead_id: leadId, action, actor, detail },
    prefer: "return=minimal",
  });
}

export async function assignCategoriesBySlugs(leadId: string, categorySlugs: string[], actor: string) {
  const slugs = Array.from(new Set(categorySlugs.map((x) => x.trim()).filter(Boolean)));
  if (!slugs.length) return;
  const categories = await fetchCategories({ activeOnly: false, kinds: [] });
  const selected = categories.filter((c) => slugs.includes(c.slug));
  if (!selected.length) return;

  for (const category of selected) {
    try {
      await supabaseRestRequest({
        schema: "leadops",
        method: "POST",
        path: "lead_category_links",
        body: { lead_id: leadId, category_id: category.id, assigned_by: actor },
        prefer: "return=minimal",
      });
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      if (!msg.includes("duplicate key")) throw error;
    }
  }
}

export async function ingestLeadToLeadOps(input: LeadOpsIngestInput, actor = "system") {
  const sourceProject = s(input.source_project);
  const sourceChannel = s(input.source_channel);
  if (!sourceProject || !sourceChannel) {
    throw new Error("source_project and source_channel are required.");
  }

  const source = await ensureSource({
    source_project: sourceProject,
    source_channel: sourceChannel,
    source_name: nullable(input.source_name),
    score_profile: nullable(input.score_profile),
  });

  const normalizedPayload = (input.normalized_payload && typeof input.normalized_payload === "object")
    ? input.normalized_payload
    : {};
  const rawPayload = (input.raw_payload && typeof input.raw_payload === "object") ? input.raw_payload : {};

  const generic = scoreGenericLead({
    source_project: sourceProject,
    source_channel: sourceChannel,
    contact_email: nullable(input.contact_email),
    contact_phone: nullable(input.contact_phone),
    company: nullable(input.company),
    website_url: nullable(input.website_url),
    message: nullable(input.message),
    industry: nullable(input.industry),
    lead_type: nullable(input.lead_type),
    tags: uniqueStrings(input.tags),
    normalized_payload: normalizedPayload,
    existingScore: typeof input.existing_score === "number" ? input.existing_score : null,
  });

  const score = typeof input.existing_score === "number" ? Math.min(100, Math.max(0, input.existing_score)) : generic.score;
  const priority = input.priority || generic.priority;
  const scoreVersion = nullable(input.score_version) || generic.version;
  const scoreBreakdown = input.score_breakdown && typeof input.score_breakdown === "object" ? input.score_breakdown : generic.breakdown;
  const spamScore = typeof input.spam_score === "number" ? Math.max(0, Math.min(100, input.spam_score)) : generic.spamScore;
  const spamConfidence = input.spam_confidence || generic.spamConfidence;
  const spamReasons = input.spam_reasons ? uniqueStrings(input.spam_reasons) : generic.spamReasons;

  const row = {
    source_id: source.id,
    source_project: sourceProject,
    source_channel: sourceChannel,
    source_name: nullable(input.source_name) || source.display_name,
    source_lead_id: nullable(input.source_lead_id),
    source_event_key: nullable(input.source_event_key),
    idempotency_key: nullable(input.idempotency_key),
    contact_name: nullable(input.contact_name),
    contact_email: nullable(input.contact_email)?.toLowerCase() || null,
    contact_phone: nullable(input.contact_phone),
    company: nullable(input.company),
    website_url: nullable(input.website_url),
    location: nullable(input.location),
    message: nullable(input.message),
    lead_type: nullable(input.lead_type),
    industry: nullable(input.industry),
    subindustry: nullable(input.subindustry),
    tags: Array.from(new Set([...uniqueStrings(input.tags), ...generic.tags])),
    normalized_payload: normalizedPayload,
    raw_payload: rawPayload,
    score,
    score_version: scoreVersion,
    score_breakdown: scoreBreakdown,
    priority,
    status: "new",
    stage: "new",
    spam_score: spamScore,
    spam_confidence: spamConfidence,
    spam_reasons: spamReasons,
    duplicate_group_key: generic.duplicateGroupKey,
    dedupe_hints: generic.dedupeHints,
    timezone: nullable(input.timezone),
    utm_source: nullable(input.utm_source),
    utm_medium: nullable(input.utm_medium),
    utm_campaign: nullable(input.utm_campaign),
    utm_term: nullable(input.utm_term),
    utm_content: nullable(input.utm_content),
    referrer: nullable(input.referrer),
    updated_at: new Date().toISOString(),
  };

  let inserted: LeadOpsLead | undefined;
  try {
    const rows = await supabaseRestRequest<LeadOpsLead[]>({
      schema: "leadops",
      method: "POST",
      path: "leads",
      body: row,
    });
    inserted = rows[0];
    await logLeadActivity(inserted?.id || null, "ingested", actor, {
      source_project: sourceProject,
      source_channel: sourceChannel,
      priority,
      score,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    if (!row.idempotency_key || !msg.includes("leadops_leads_idempotency_key_uidx")) {
      throw error;
    }
    const rows = await supabaseRestRequest<LeadOpsLead[]>({
      schema: "leadops",
      path: `leads?select=*&idempotency_key=eq.${encodeURIComponent(row.idempotency_key)}&limit=1`,
    });
    inserted = rows[0];
  }

  if (!inserted) throw new Error("Lead ingest failed: no record returned.");

  const categorySlugs = uniqueStrings(input.categories);
  if (input.industry) categorySlugs.push(s(input.industry));
  if (input.lead_type) categorySlugs.push(s(input.lead_type));
  if (sourceChannel) categorySlugs.push(sourceChannel.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
  await assignCategoriesBySlugs(inserted.id, categorySlugs, actor);

  return inserted;
}

export type LeadOpsLeadWithCategories = LeadOpsLead & {
  lead_category_links?: Array<{ category_id: string; category?: LeadOpsCategory | null }>;
};

export type LeadOpsFilter = {
  q?: string;
  source_project?: string;
  source_channel?: string;
  industry?: string;
  lead_type?: string;
  priority?: string;
  status?: string;
  stage?: string;
  reviewed?: "yes" | "no";
  owner?: string;
  assignee?: string;
  from?: string;
  to?: string;
  category_slug?: string;
  hot_today?: "1";
  overdue_followups?: "1";
};

export function parseStringParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim() : "";
}

function encodeFilter(parts: string[]) {
  return parts.filter(Boolean).join("&");
}

export function buildLeadOpsLeadQuery(filter: LeadOpsFilter, limit = 100) {
  const select = [
    "*",
    "lead_category_links(category_id,category:categories(id,kind,slug,label,color,active,sort_order,description))",
  ].join(",");
  const parts: string[] = [`select=${encodeURIComponent(select)}`, `limit=${limit}`, "order=score.desc,created_at.desc"];

  parts.push("merged_into_lead_id=is.null");

  if (filter.hot_today === "1") {
    parts.push("priority=eq.high");
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    parts.push(`created_at=gte.${encodeURIComponent(start.toISOString())}`);
  }

  if (filter.overdue_followups === "1") {
    parts.push(`follow_up_at=lt.${encodeURIComponent(new Date().toISOString())}`);
  }

  if (filter.source_project) parts.push(`source_project=eq.${encodeURIComponent(filter.source_project)}`);
  if (filter.source_channel) parts.push(`source_channel=eq.${encodeURIComponent(filter.source_channel)}`);
  if (filter.industry) parts.push(`industry=eq.${encodeURIComponent(filter.industry)}`);
  if (filter.lead_type) parts.push(`lead_type=eq.${encodeURIComponent(filter.lead_type)}`);
  if (filter.priority) parts.push(`priority=eq.${encodeURIComponent(filter.priority)}`);
  if (filter.status) parts.push(`status=eq.${encodeURIComponent(filter.status)}`);
  if (filter.stage) parts.push(`stage=eq.${encodeURIComponent(filter.stage)}`);
  if (filter.owner) parts.push(`owner=eq.${encodeURIComponent(filter.owner)}`);
  if (filter.assignee) parts.push(`assignee=eq.${encodeURIComponent(filter.assignee)}`);
  if (filter.reviewed === "yes") parts.push("classification_reviewed_at=not.is.null");
  if (filter.reviewed === "no") parts.push("classification_reviewed_at=is.null");
  if (filter.from) parts.push(`created_at=gte.${encodeURIComponent(filter.from)}`);
  if (filter.to) parts.push(`created_at=lte.${encodeURIComponent(filter.to)}`);

  if (filter.q) {
    const q = filter.q.replace(/,/g, " ").trim();
    if (q) {
      const v = `*${q.replace(/\*/g, "") }*`;
      parts.push(
        `or=(${[
          `contact_name.ilike.${encodeURIComponent(v)}`,
          `contact_email.ilike.${encodeURIComponent(v)}`,
          `contact_phone.ilike.${encodeURIComponent(v)}`,
          `company.ilike.${encodeURIComponent(v)}`,
          `website_url.ilike.${encodeURIComponent(v)}`,
          `message.ilike.${encodeURIComponent(v)}`,
          `source_project.ilike.${encodeURIComponent(v)}`,
        ].join(",")})`,
      );
    }
  }

  return encodeFilter(parts);
}

export async function fetchLeadOpsLeads(filter: LeadOpsFilter, limit = 100) {
  return supabaseRestRequest<LeadOpsLeadWithCategories[]>({
    schema: "leadops",
    path: `leads?${buildLeadOpsLeadQuery(filter, limit)}`,
  });
}

export async function fetchCategories(args: { activeOnly?: boolean; kinds?: string[] }) {
  const parts = ["select=id,kind,slug,label,color,active,sort_order,description", "order=kind.asc,sort_order.asc,label.asc"];
  if (args.activeOnly) parts.push("active=eq.true");
  if (args.kinds?.length) {
    parts.push(`kind=in.(${args.kinds.map((k) => `\"${k}\"`).join(",")})`);
  }
  return supabaseRestRequest<LeadOpsCategory[]>({ schema: "leadops", path: `categories?${parts.join("&")}` });
}

export async function fetchSources() {
  return supabaseRestRequest<LeadOpsSource[]>({
    schema: "leadops",
    path: "sources?select=id,source_project,source_channel,source_key,display_name,scoring_profile,last_seen_at,health_status&order=source_project.asc,source_channel.asc",
  });
}

export async function fetchSavedViews() {
  return supabaseRestRequest<LeadOpsSavedView[]>({
    schema: "leadops",
    path: "saved_views?select=id,name,slug,owner,filters,sort_order,pinned,active&active=eq.true&order=pinned.desc,sort_order.asc,created_at.asc",
  });
}

export async function fetchLeadActivities(leadId: string, limit = 20) {
  return supabaseRestRequest<Array<{ id: string; created_at: string; actor: string | null; action: string; detail: Record<string, unknown> }>>({
    schema: "leadops",
    path: `lead_activities?select=id,created_at,actor,action,detail&lead_id=eq.${encodeURIComponent(leadId)}&order=created_at.desc&limit=${limit}`,
  });
}

export async function fetchSourceHealthSummary() {
  const sources = await fetchSources();
  const now = Date.now();
  return sources.map((s) => {
    const ageHours = s.last_seen_at ? (now - new Date(s.last_seen_at).getTime()) / 36e5 : null;
    const computedHealth = ageHours == null ? "unknown" : ageHours > 72 ? "stale" : ageHours > 24 ? "warning" : "healthy";
    return { ...s, ageHours, computedHealth };
  });
}

export async function fetchRecentLeadOpsActivities(limit = 30) {
  return supabaseRestRequest<Array<{ id: string; created_at: string; actor: string | null; action: string; detail: Record<string, unknown>; lead_id: string | null }>>({
    schema: "leadops",
    path: `lead_activities?select=id,created_at,actor,action,detail,lead_id&order=created_at.desc&limit=${limit}`,
  });
}

export async function fetchLeadOpsMetrics() {
  const [hot, total, unreviewed, overdue] = await Promise.all([
    supabaseRestRequest<Array<{ count: number }>>({ schema: "leadops", path: "leads?select=count&priority=eq.high&merged_into_lead_id=is.null" }),
    supabaseRestRequest<Array<{ count: number }>>({ schema: "leadops", path: "leads?select=count&merged_into_lead_id=is.null" }),
    supabaseRestRequest<Array<{ count: number }>>({ schema: "leadops", path: "leads?select=count&classification_reviewed_at=is.null&merged_into_lead_id=is.null" }),
    supabaseRestRequest<Array<{ count: number }>>({ schema: "leadops", path: `leads?select=count&follow_up_at=lt.${encodeURIComponent(new Date().toISOString())}&merged_into_lead_id=is.null` }),
  ]);
  const countVal = (rows: Array<{ count: number }>) => Number(rows?.[0]?.count || 0);
  return {
    hot: countVal(hot),
    total: countVal(total),
    unreviewed: countVal(unreviewed),
    overdueFollowups: countVal(overdue),
  };
}

export async function fetchDuplicateCandidates(limit = 25) {
  const leads = await supabaseRestRequest<LeadOpsLead[]>({
    schema: "leadops",
    path: `leads?select=id,created_at,contact_name,contact_email,company,website_url,score,priority,duplicate_group_key,dedupe_hints,merged_into_lead_id&merged_into_lead_id=is.null&order=created_at.desc&limit=500`,
  });

  const groups = new Map<string, LeadOpsLead[]>();
  for (const lead of leads) {
    const key = lead.duplicate_group_key || "";
    if (!key) continue;
    const arr = groups.get(key) || [];
    arr.push(lead);
    groups.set(key, arr);
  }
  return Array.from(groups.entries())
    .filter(([, arr]) => arr.length > 1)
    .slice(0, limit)
    .map(([key, arr]) => ({ key, leads: arr.sort((a, b) => b.score - a.score) }));
}

export function csvEscape(value: unknown) {
  const str = value == null ? "" : String(value);
  if (/[,"\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

export function leadsToCsv(leads: LeadOpsLeadWithCategories[]) {
  const headers = [
    "id","created_at","source_project","source_channel","contact_name","contact_email","contact_phone","company","website_url","location","industry","lead_type","score","priority","status","stage","owner","assignee","follow_up_at","classification_reviewed_at","classification_review","spam_score","spam_confidence","tags","categories","message"
  ];
  const rows = leads.map((lead) => {
    const categories = (lead.lead_category_links || [])
      .map((l) => l.category?.slug)
      .filter(Boolean)
      .join("|");
    return [
      lead.id,
      lead.created_at,
      lead.source_project,
      lead.source_channel,
      lead.contact_name,
      lead.contact_email,
      lead.contact_phone,
      lead.company,
      lead.website_url,
      lead.location,
      lead.industry,
      lead.lead_type,
      lead.score,
      lead.priority,
      lead.status,
      lead.stage,
      lead.owner,
      lead.assignee,
      lead.follow_up_at,
      lead.classification_reviewed_at,
      lead.classification_review,
      lead.spam_score,
      lead.spam_confidence,
      (lead.tags || []).join("|"),
      categories,
      lead.message,
    ].map(csvEscape).join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}
