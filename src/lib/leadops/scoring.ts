export type LeadOpsPriority = "low" | "medium" | "high";

export type LeadOpsScoreResult = {
  score: number;
  priority: LeadOpsPriority;
  version: string;
  breakdown: Record<string, number | string | string[] | boolean | null>;
  tags: string[];
  dedupeHints: string[];
  spamScore: number;
  spamConfidence: "low" | "medium" | "high";
  spamReasons: string[];
  duplicateGroupKey: string | null;
};

export type GenericLeadForScoring = {
  source_project: string;
  source_channel: string;
  contact_email?: string | null;
  contact_phone?: string | null;
  company?: string | null;
  website_url?: string | null;
  message?: string | null;
  industry?: string | null;
  lead_type?: string | null;
  status?: string | null;
  tags?: string[];
  normalized_payload?: Record<string, unknown>;
  existingScore?: number | null;
};

function normalizeEmail(email?: string | null) {
  return (email || "").trim().toLowerCase();
}

function normalizePhone(phone?: string | null) {
  return (phone || "").replace(/\D+/g, "");
}

function domainFromWebsite(website?: string | null) {
  const raw = (website || "").trim();
  if (!raw) return "";
  try {
    const url = new URL(raw.startsWith("http") ? raw : `https://${raw}`);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return raw.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0]?.toLowerCase() || "";
  }
}

export function scoreGenericLead(input: GenericLeadForScoring): LeadOpsScoreResult {
  let score = 0;
  const tags = new Set<string>(input.tags || []);
  const breakdown: LeadOpsScoreResult["breakdown"] = { profile: "generic-v1" };

  const message = (input.message || "").trim();
  const company = (input.company || "").trim();
  const email = normalizeEmail(input.contact_email);
  const phone = normalizePhone(input.contact_phone);
  const domain = domainFromWebsite(input.website_url);
  const normalized = input.normalized_payload || {};

  if (email) score += 10;
  if (phone) score += 8;
  if (company) score += 8;
  if (domain) score += 10;
  if (message.length >= 40) score += 12;
  if (message.length >= 120) score += 10;

  const urgencyText = JSON.stringify(normalized).toLowerCase() + " " + message.toLowerCase();
  if (/asap|urgent|this week|immediately/.test(urgencyText)) score += 15;
  else if (/this month|soon/.test(urgencyText)) score += 10;

  if (input.industry) {
    score += 5;
    tags.add(`industry-${input.industry}`);
  }
  if (input.lead_type) {
    score += 5;
    tags.add(`type-${input.lead_type}`);
  }

  if (input.source_project) tags.add(`project-${input.source_project}`);
  if (input.source_channel) tags.add(`channel-${input.source_channel}`);

  if (typeof input.existingScore === "number") {
    score = Math.max(score, Math.min(100, input.existingScore));
    breakdown.source_score = input.existingScore;
  }

  score = Math.min(100, score);
  breakdown.final_score = score;

  const priority: LeadOpsPriority = score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  const spamReasons: string[] = [];
  let spamScore = 0;
  if (!email && !phone) {
    spamScore += 40;
    spamReasons.push("missing-contact");
  }
  if (message && /(seo service|casino|crypto|loan)/i.test(message)) {
    spamScore += 50;
    spamReasons.push("suspicious-keywords");
  }
  if (message && message.length < 8) {
    spamScore += 10;
    spamReasons.push("very-short-message");
  }
  spamScore = Math.min(100, spamScore);
  const spamConfidence = spamScore >= 60 ? "high" : spamScore >= 25 ? "medium" : "low";

  const dedupeHints: string[] = [];
  if (email) dedupeHints.push(`email:${email}`);
  if (phone) dedupeHints.push(`phone:${phone}`);
  if (domain) dedupeHints.push(`domain:${domain}`);
  const duplicateGroupKey = email || phone || domain || null;

  return {
    score,
    priority,
    version: "generic-v1",
    breakdown,
    tags: Array.from(tags),
    dedupeHints,
    spamScore,
    spamConfidence,
    spamReasons,
    duplicateGroupKey,
  };
}
