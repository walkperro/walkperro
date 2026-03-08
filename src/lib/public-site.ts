export const INQUIRY_HELP_OPTIONS = [
  "AI Editorial Visuals",
  "Signature Site",
  "Business System Site",
  "Website Redesign",
  "New Website",
  "AI Workflow / Automation",
  "Custom Build / App",
  "Creative Direction / Branding",
] as const;

export const INQUIRY_INVESTMENT_OPTIONS = [
  "$300",
  "$1,500",
  "$3,000",
  "$5,000+",
  "Not sure yet",
] as const;

export const INQUIRY_TIMELINE_OPTIONS = [
  "ASAP (within 2 weeks)",
  "This month",
  "Next 1–2 months",
  "Flexible / exploring",
] as const;

export type InquiryHelpOption = (typeof INQUIRY_HELP_OPTIONS)[number];
export type InquiryInvestmentOption = (typeof INQUIRY_INVESTMENT_OPTIONS)[number];
export type InquiryTimelineOption = (typeof INQUIRY_TIMELINE_OPTIONS)[number];

export const STUDIO_OFFERS = [
  {
    slug: "ai-editorial-visuals",
    name: "AI Editorial Visuals",
    price: "$300",
    summary:
      "Polished visuals for websites, branding, campaigns, and social content. We refine existing photos or create elevated visuals based on client references.",
    includes: [
      "Up to 6 edited or generated images",
      "Website-ready exports",
      "Social-ready crops",
      "Cohesive visual direction",
      "High-resolution delivery",
    ],
  },
  {
    slug: "signature-site",
    name: "Signature Site",
    price: "$1,500",
    summary:
      "A polished website built to present a business clearly, professionally, and beautifully. Includes AI-enhanced visuals, strong structure, and a clean web presence designed to convert attention into inquiries.",
    includes: [
      "Custom homepage + core information pages",
      "AI-enhanced or AI-generated visuals based on client references",
      "Mobile-responsive design",
      "On-page SEO foundation",
      "Google presence / indexing setup",
      "Inquiry / contact system",
      "Performance-optimized build",
      "No backend/admin",
    ],
  },
  {
    slug: "business-system-site",
    name: "Business System Site",
    price: "$3,000",
    summary:
      "Everything in the Signature Site, plus a custom admin/backend experience for managing content, leads, or internal workflows.",
    includes: [
      "Everything in Signature Site",
      "Custom admin/backend dashboard",
      "Content or lead management tools",
      "Flexible architecture for growth",
      "Workflow integration capability",
    ],
  },
  {
    slug: "custom-builds-creative-direction",
    name: "Custom Builds & Creative Direction",
    price: "Custom",
    summary: "For brands that need more than a standard site.",
    includes: [
      "Custom logos and visual direction",
      "Brand positioning and creative direction",
      "Special app creation inquiries",
      "Sign-in / authentication systems",
      "AI workflow automation and bot setup",
      "Internal tools and process systems",
      "Consultation-based custom work",
    ],
  },
] as const;

export function deriveScopeFromIntent(intent: string) {
  switch (intent) {
    case "AI Editorial Visuals":
      return "Editorial visuals";
    case "Signature Site":
    case "Website Redesign":
    case "New Website":
      return "Website presentation project";
    case "Business System Site":
      return "Website + backend system";
    case "AI Workflow / Automation":
      return "AI workflow / automation";
    case "Custom Build / App":
      return "Custom build / app";
    case "Creative Direction / Branding":
      return "Creative direction / branding";
    default:
      return "Custom build / app";
  }
}

export function normalizeIntentQuery(value?: string | string[]) {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return "";
  const decoded = decodeURIComponent(raw).trim().toLowerCase();
  const match = INQUIRY_HELP_OPTIONS.find((option) => option.toLowerCase() === decoded);
  return match || "";
}
