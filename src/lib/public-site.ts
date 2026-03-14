export const INQUIRY_HELP_OPTIONS = [
  "AI Editorial Visuals",
  "Virtual Business Card",
  "Business Growth Suite",
  "Website Redesign",
  "New Website",
  "AI Workflow / Automation",
  "Custom Build / App",
  "Custom Inquiry",
] as const;

export const INQUIRY_INVESTMENT_OPTIONS = [
  "$300",
  "$1,200",
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

type OfferInclude = {
  text: string;
  accent?: string;
  emphasis?: boolean;
};

type StudioOffer = {
  slug: string;
  name: string;
  price: string;
  summary: string;
  badge?: string;
  ctaLabel: string;
  footLabel: string;
  featured?: boolean;
  includes: readonly OfferInclude[];
};

export const STUDIO_OFFERS: readonly StudioOffer[] = [
  {
    slug: "ai-editorial-visuals",
    name: "AI Editorial Visuals",
    price: "$300",
    summary: "Editorial visuals for websites, campaigns, profiles, and promotional use.",
    ctaLabel: "Ask about visuals",
    footLabel: "Creative add-on",
    includes: [
      {
        text: "12 AI-edited or generated editorial-style visuals for websites, social media, model profiles, ads, album covers, magazine covers, and similar use.",
      },
      {
        text: "Existing photos can be transformed through changes to angle, lighting, wardrobe, posture, expression, and image elements.",
      },
      { text: "Finished visuals can also be arranged into editorial collage or poster layouts for promotion." },
      { text: "Deliverables include both the final images and the completed collage layouts." },
      {
        text: "If no photos exist, realistic professional visuals can be created from a face reference or even an idea.",
      },
      { text: "Delivered in high quality, including 2K / 4K options." },
    ],
  },
  {
    slug: "virtual-business-card",
    name: "Virtual Business Card",
    price: "$1,200",
    summary: "A polished website for businesses and creators who need stronger presentation and clearer conversion.",
    badge: "Most Popular",
    ctaLabel: "Start here",
    footLabel: "Best starting point",
    featured: true,
    includes: [
      {
        text: "Beautifully designed website for businesses and creators that represents the brand clearly and is built to convert clients.",
      },
      { text: "Includes the essential informational pages your business needs." },
      {
        text: "We edit existing photos or create visuals from scratch to fit what the layout actually needs.",
      },
      {
        text: "Unless you prefer otherwise, we refine and expand your messaging so the site communicates your value more clearly.",
      },
      { text: "Designed to feel polished across desktop, tablet, and mobile." },
      { text: "SEO setup helps your business name and relevant keywords appear on Google." },
      { text: "Logo creation is included if needed." },
    ],
  },
  {
    slug: "business-growth-suite",
    name: "Business Growth Suite",
    price: "$3,000",
    summary: "For businesses that want the website and the growth-ready operational layer behind it.",
    ctaLabel: "Discuss this build",
    footLabel: "Scale-ready scope",
    includes: [
      {
        text: "Everything included in Virtual Business Card",
        accent: "Virtual Business Card",
        emphasis: true,
      },
      { text: "Includes a customizable admin portal or dashboard for the owner or manager." },
      {
        text: "Example features can include lead tracking, traffic monitoring, page editing, email blasts, banner updates, and file or lead storage.",
      },
      { text: "Feasible admin ideas can be discussed and implemented around the business's needs." },
    ],
  },
  {
    slug: "custom-inquiry",
    name: "Custom Inquiry",
    price: "Custom",
    summary: "For businesses that need something beyond the listed packages.",
    ctaLabel: "Request a consultation",
    footLabel: "Consultation-led",
    includes: [
      {
        text: "If you need user-login systems, AI workflow automation, creative direction, branding, or other custom functionality, reach out by email or social media for a consultation.",
      },
    ],
  },
] as const;

export function deriveScopeFromIntent(intent: string) {
  switch (intent) {
    case "AI Editorial Visuals":
      return "Editorial visuals";
    case "Signature Site":
    case "Virtual Business Card":
    case "Website Redesign":
    case "New Website":
      return "Website presentation project";
    case "Business System Site":
    case "Business Growth Suite":
      return "Website + backend system";
    case "AI Workflow / Automation":
      return "AI workflow / automation";
    case "Custom Build / App":
    case "Custom Inquiry":
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
  const aliases: Record<string, string> = {
    "signature site": "Virtual Business Card",
    "business system site": "Business Growth Suite",
    "custom builds & creative direction": "Custom Inquiry",
    "creative direction / branding": "Custom Inquiry",
  };
  if (aliases[decoded]) return aliases[decoded];
  const match = INQUIRY_HELP_OPTIONS.find((option) => option.toLowerCase() === decoded);
  return match || "";
}
