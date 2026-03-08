import {
  INQUIRY_HELP_OPTIONS,
  INQUIRY_INVESTMENT_OPTIONS,
  INQUIRY_TIMELINE_OPTIONS,
} from "@/lib/public-site";

const LEGACY_INTENT_OPTIONS = [
  "Get more leads",
  "Launch a new site",
  "Fix a site that isn’t converting",
  "Build an internal dashboard / portal",
  "Not sure (need guidance)",
] as const;

const LEAN_SCOPE_OPTIONS = [
  "Editorial visuals",
  "Website presentation project",
  "Website + backend system",
  "AI workflow / automation",
  "Custom build / app",
  "Creative direction / branding",
] as const;

const LEGACY_SCOPE_OPTIONS = [
  "Landing / 1–3 pages",
  "Full website (5–12 pages)",
  "Website + booking / inquiry system",
  "Website + admin portal",
  "Custom build (tell us)",
] as const;

const LEGACY_BUDGET_OPTIONS = [
  "$500–$1,500 (starter)",
  "$1,500–$4,000 (serious)",
  "$4,000–$10,000 (premium)",
  "$10,000+ (full system)",
] as const;

const LEGACY_TIMELINE_OPTIONS = [
  "ASAP (1–2 weeks)",
  "This month",
  "Next 1–2 months",
  "Exploring / no rush",
] as const;

export const GROWTH_FLAG_OPTIONS = [
  "Google searchable (SEO)",
  "Track actions + traffic (GA4)",
  "Conversion tracking for Ads",
  "Google Ads setup",
  "Email/SMS follow-up automations",
] as const;

export const MARKETING_SPEND_OPTIONS = [
  "$0 (not yet)",
  "$1–$500/mo",
  "$500–$2,000/mo",
  "$2,000–$10,000/mo",
  "$10,000+/mo",
] as const;

export const MONTHLY_REVENUE_OPTIONS = [
  "Pre-revenue / just starting",
  "$1k–$10k",
  "$10k–$50k",
  "$50k–$200k",
  "$200k+",
] as const;

export const INTENT_OPTIONS = [...INQUIRY_HELP_OPTIONS, ...LEGACY_INTENT_OPTIONS] as const;
export const TIMELINE_OPTIONS = [...INQUIRY_TIMELINE_OPTIONS, ...LEGACY_TIMELINE_OPTIONS] as const;
export const SCOPE_OPTIONS = [...LEAN_SCOPE_OPTIONS, ...LEGACY_SCOPE_OPTIONS] as const;
export const PROJECT_BUDGET_OPTIONS = [...INQUIRY_INVESTMENT_OPTIONS, ...LEGACY_BUDGET_OPTIONS] as const;

export type LeadIntent = (typeof INTENT_OPTIONS)[number];
export type LeadTimeline = (typeof TIMELINE_OPTIONS)[number];
export type LeadScope = (typeof SCOPE_OPTIONS)[number];
export type GrowthFlag = (typeof GROWTH_FLAG_OPTIONS)[number];
export type ProjectBudgetRange = (typeof PROJECT_BUDGET_OPTIONS)[number];
export type MonthlyMarketingSpendRange = (typeof MARKETING_SPEND_OPTIONS)[number];
export type MonthlyRevenueRange = (typeof MONTHLY_REVENUE_OPTIONS)[number];

export type ScoringInput = {
  intent: LeadIntent;
  timeline: LeadTimeline;
  scope: LeadScope;
  growth_flags: GrowthFlag[];
  project_budget_range: ProjectBudgetRange;
  monthly_marketing_spend_range: MonthlyMarketingSpendRange;
  open_to_ads_if_roi_clear: boolean;
  decision_maker: boolean;
};

export type ScoringResult = {
  score: number;
  priority: "low" | "medium" | "high";
  tags: string[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function scoreBudget(range: ProjectBudgetRange) {
  switch (range) {
    case "$300":
      return 8;
    case "$1,500":
      return 26;
    case "$3,000":
      return 44;
    case "$5,000+":
      return 56;
    case "Not sure yet":
      return 16;
    case "$500–$1,500 (starter)":
      return 12;
    case "$1,500–$4,000 (serious)":
      return 25;
    case "$4,000–$10,000 (premium)":
      return 40;
    case "$10,000+ (full system)":
      return 52;
    default:
      return 0;
  }
}

function scoreTimeline(timeline: LeadTimeline) {
  switch (timeline) {
    case "ASAP (within 2 weeks)":
    case "ASAP (1–2 weeks)":
      return 18;
    case "This month":
      return 14;
    case "Next 1–2 months":
      return 10;
    case "Flexible / exploring":
    case "Exploring / no rush":
      return 4;
    default:
      return 0;
  }
}

function scoreScope(scope: LeadScope) {
  switch (scope) {
    case "Editorial visuals":
      return 6;
    case "Website presentation project":
      return 12;
    case "Website + backend system":
      return 22;
    case "AI workflow / automation":
      return 18;
    case "Custom build / app":
      return 20;
    case "Creative direction / branding":
      return 12;
    case "Landing / 1–3 pages":
      return 6;
    case "Full website (5–12 pages)":
      return 10;
    case "Website + booking / inquiry system":
      return 14;
    case "Website + admin portal":
      return 22;
    case "Custom build (tell us)":
      return 16;
    default:
      return 0;
  }
}

function scoreMarketingSpend(range: MonthlyMarketingSpendRange) {
  switch (range) {
    case "$0 (not yet)":
      return 0;
    case "$1–$500/mo":
      return 4;
    case "$500–$2,000/mo":
      return 8;
    case "$2,000–$10,000/mo":
      return 16;
    case "$10,000+/mo":
      return 22;
    default:
      return 0;
  }
}

function scoreGrowthFlags(flags: GrowthFlag[]) {
  return flags.reduce((total, flag) => {
    switch (flag) {
      case "Google Ads setup":
        return total + 10;
      case "Email/SMS follow-up automations":
        return total + 8;
      default:
        return total + 4;
    }
  }, 0);
}

export function scoreLead(input: ScoringInput): ScoringResult {
  let score = 0;

  score += scoreBudget(input.project_budget_range);
  score += scoreTimeline(input.timeline);
  score += scoreScope(input.scope);
  score += scoreMarketingSpend(input.monthly_marketing_spend_range);
  score += scoreGrowthFlags(input.growth_flags);

  if (input.open_to_ads_if_roi_clear) score += 6;
  if (input.decision_maker) score += 8;

  score = Math.min(100, score);

  const priority: ScoringResult["priority"] =
    score >= 70 ? "high" : score >= 38 ? "medium" : "low";

  const tags = new Set<string>([
    `intent-${slugify(input.intent)}`,
    `timeline-${slugify(input.timeline)}`,
    `scope-${slugify(input.scope)}`,
    `budget-${slugify(input.project_budget_range)}`,
    `marketing-${slugify(input.monthly_marketing_spend_range)}`,
  ]);

  input.growth_flags.forEach((flag) => tags.add(`growth-${slugify(flag)}`));
  if (input.decision_maker) tags.add("decision-maker");
  if (input.open_to_ads_if_roi_clear) tags.add("ads-open");

  return {
    score,
    priority,
    tags: Array.from(tags),
  };
}
