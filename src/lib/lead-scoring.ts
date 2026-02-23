export type LeadIntent =
  | "Get more leads"
  | "Launch a new site"
  | "Fix a site that isn’t converting"
  | "Build an internal dashboard / portal"
  | "Not sure (need guidance)";

export type LeadTimeline =
  | "ASAP (1–2 weeks)"
  | "This month"
  | "Next 1–2 months"
  | "Exploring / no rush";

export type LeadScope =
  | "Landing / 1–3 pages"
  | "Full website (5–12 pages)"
  | "Website + booking / inquiry system"
  | "Website + admin portal"
  | "Custom build (tell us)";

export type GrowthFlag =
  | "Google searchable (SEO)"
  | "Track actions + traffic (GA4)"
  | "Conversion tracking for Ads"
  | "Google Ads setup"
  | "Email/SMS follow-up automations";

export type ProjectBudgetRange =
  | "$500–$1,500 (starter)"
  | "$1,500–$4,000 (serious)"
  | "$4,000–$10,000 (premium)"
  | "$10,000+ (full system)";

export type MonthlyMarketingSpendRange =
  | "$0 (not yet)"
  | "$1–$500/mo"
  | "$500–$2,000/mo"
  | "$2,000–$10,000/mo"
  | "$10,000+/mo";

export type MonthlyRevenueRange =
  | "Pre-revenue / just starting"
  | "$1k–$10k"
  | "$10k–$50k"
  | "$50k–$200k"
  | "$200k+";

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

export const INTENT_OPTIONS: LeadIntent[] = [
  "Get more leads",
  "Launch a new site",
  "Fix a site that isn’t converting",
  "Build an internal dashboard / portal",
  "Not sure (need guidance)",
];

export const TIMELINE_OPTIONS: LeadTimeline[] = [
  "ASAP (1–2 weeks)",
  "This month",
  "Next 1–2 months",
  "Exploring / no rush",
];

export const SCOPE_OPTIONS: LeadScope[] = [
  "Landing / 1–3 pages",
  "Full website (5–12 pages)",
  "Website + booking / inquiry system",
  "Website + admin portal",
  "Custom build (tell us)",
];

export const GROWTH_FLAG_OPTIONS: GrowthFlag[] = [
  "Google searchable (SEO)",
  "Track actions + traffic (GA4)",
  "Conversion tracking for Ads",
  "Google Ads setup",
  "Email/SMS follow-up automations",
];

export const PROJECT_BUDGET_OPTIONS: ProjectBudgetRange[] = [
  "$500–$1,500 (starter)",
  "$1,500–$4,000 (serious)",
  "$4,000–$10,000 (premium)",
  "$10,000+ (full system)",
];

export const MARKETING_SPEND_OPTIONS: MonthlyMarketingSpendRange[] = [
  "$0 (not yet)",
  "$1–$500/mo",
  "$500–$2,000/mo",
  "$2,000–$10,000/mo",
  "$10,000+/mo",
];

export const MONTHLY_REVENUE_OPTIONS: MonthlyRevenueRange[] = [
  "Pre-revenue / just starting",
  "$1k–$10k",
  "$10k–$50k",
  "$50k–$200k",
  "$200k+",
];

const budgetScores: Record<ProjectBudgetRange, number> = {
  "$500–$1,500 (starter)": 10,
  "$1,500–$4,000 (serious)": 25,
  "$4,000–$10,000 (premium)": 40,
  "$10,000+ (full system)": 50,
};

const timelineScores: Record<LeadTimeline, number> = {
  "ASAP (1–2 weeks)": 20,
  "This month": 15,
  "Next 1–2 months": 10,
  "Exploring / no rush": 0,
};

const scopeScores: Record<LeadScope, number> = {
  "Landing / 1–3 pages": 5,
  "Full website (5–12 pages)": 10,
  "Website + booking / inquiry system": 15,
  "Website + admin portal": 25,
  "Custom build (tell us)": 15,
};

const growthScores: Record<GrowthFlag, number> = {
  "Google searchable (SEO)": 5,
  "Track actions + traffic (GA4)": 5,
  "Conversion tracking for Ads": 5,
  "Google Ads setup": 15,
  "Email/SMS follow-up automations": 10,
};

const marketingScores: Record<MonthlyMarketingSpendRange, number> = {
  "$0 (not yet)": 0,
  "$1–$500/mo": 5,
  "$500–$2,000/mo": 10,
  "$2,000–$10,000/mo": 20,
  "$10,000+/mo": 30,
};

const intentTags: Record<LeadIntent, string> = {
  "Get more leads": "more-leads",
  "Launch a new site": "launch",
  "Fix a site that isn’t converting": "fix-conversions",
  "Build an internal dashboard / portal": "admin-portal",
  "Not sure (need guidance)": "unsure",
};

const timelineTags: Record<LeadTimeline, string> = {
  "ASAP (1–2 weeks)": "asap",
  "This month": "this-month",
  "Next 1–2 months": "1-2-months",
  "Exploring / no rush": "exploring",
};

const growthTags: Record<GrowthFlag, string> = {
  "Google searchable (SEO)": "seo",
  "Track actions + traffic (GA4)": "ga4",
  "Conversion tracking for Ads": "ads-tracking",
  "Google Ads setup": "google-ads",
  "Email/SMS follow-up automations": "automations",
};

const budgetTags: Record<ProjectBudgetRange, string> = {
  "$500–$1,500 (starter)": "budget-starter",
  "$1,500–$4,000 (serious)": "budget-serious",
  "$4,000–$10,000 (premium)": "budget-premium",
  "$10,000+ (full system)": "budget-10k-plus",
};

const marketingTags: Record<MonthlyMarketingSpendRange, string> = {
  "$0 (not yet)": "mkt-0",
  "$1–$500/mo": "mkt-1-500",
  "$500–$2,000/mo": "mkt-500-2000",
  "$2,000–$10,000/mo": "mkt-2000-10000",
  "$10,000+/mo": "mkt-10000-plus",
};

const scopeTags: Record<LeadScope, string> = {
  "Landing / 1–3 pages": "landing",
  "Full website (5–12 pages)": "full-site",
  "Website + booking / inquiry system": "booking-system",
  "Website + admin portal": "admin-portal-scope",
  "Custom build (tell us)": "custom-build",
};

export function scoreLead(input: ScoringInput): ScoringResult {
  let score = 0;

  score += budgetScores[input.project_budget_range] ?? 0;
  score += timelineScores[input.timeline] ?? 0;
  score += scopeScores[input.scope] ?? 0;
  score += marketingScores[input.monthly_marketing_spend_range] ?? 0;

  for (const flag of input.growth_flags) {
    score += growthScores[flag] ?? 0;
  }

  if (input.open_to_ads_if_roi_clear) score += 10;
  if (input.decision_maker) score += 10;

  score = Math.min(100, score);

  const priority: ScoringResult["priority"] =
    score >= 70 ? "high" : score >= 40 ? "medium" : "low";

  const tags = new Set<string>();
  tags.add(intentTags[input.intent]);
  tags.add(timelineTags[input.timeline]);
  tags.add(scopeTags[input.scope]);
  tags.add(budgetTags[input.project_budget_range]);
  tags.add(marketingTags[input.monthly_marketing_spend_range]);

  for (const flag of input.growth_flags) {
    tags.add(growthTags[flag]);
  }

  if (input.decision_maker) tags.add("decision-maker");

  return {
    score,
    priority,
    tags: Array.from(tags),
  };
}
