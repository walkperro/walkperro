// Source of truth for the projects rendered on the homepage:
//   • flagship projects → render as <LinkCard> in the linktree stack
//   • portfolio projects → only appear in the autoplaying <ProjectStage>
//
// To upgrade re-study from waitlist to live: set `externalUrl` and remove
// `waitlistSource`. To attach a demo video to any project: drop the file at
// /public/projects/<slug>/demo.mp4 and set `video: "/projects/<slug>/demo.mp4"`.

export type Project = {
  slug: string;
  title: string;                 // display title, voice-clean (lowercase)
  blurb: string;                 // one sentence, lowercase
  image: string;                 // /projects/<slug>/hero.webp (1600x1000, ≤120kb)
  video?: string;                // optional /projects/<slug>/demo.mp4 (≤2MB H.264)
  externalUrl?: string;          // present for live external apps
  internalHref?: string;         // present for in-site routes (/tools/painmine)
  waitlistSource?: string;       // present when card opens a waitlist EmailCapture
  tags: string[];
  kind: "flagship" | "portfolio";
  status: "live" | "waitlist" | "building";
  order: number;
};

export const PROJECTS: Project[] = [
  // ---------- flagships (render as big LinkCards) ----------
  {
    slug: "closehound",
    title: "closehound",
    blurb: "section 8 housing sellers get vetted leads, ai-assisted close mechanics.",
    image: "/projects/closehound/hero.svg",
    externalUrl: "https://closehound.com",
    tags: ["product", "real-estate", "ai"],
    kind: "flagship",
    status: "live",
    order: 1,
  },
  {
    slug: "asere",
    title: "asere",
    blurb: "spanish for miami — voice-first, cuban inflected, fluency in months not years.",
    image: "/projects/asere/hero.svg",
    externalUrl: "https://asere.vercel.app",
    tags: ["product", "language", "education"],
    kind: "flagship",
    status: "live",
    order: 2,
  },
  {
    slug: "1k2rich",
    title: "1k2rich",
    blurb: "watch a trading bot turn $1k into something — every position, public.",
    image: "/projects/1k2rich/hero.svg",
    externalUrl: "https://1k2rich.vercel.app",
    tags: ["product", "trading", "transparency"],
    kind: "flagship",
    status: "live",
    order: 3,
  },
  {
    slug: "re-study",
    title: "re-study",
    blurb: "the ga/fl real estate edge — pass the exam, find the deal, close it.",
    image: "/projects/re-study/hero.svg",
    waitlistSource: "re-study",
    tags: ["product", "real-estate", "education"],
    kind: "flagship",
    status: "waitlist",
    order: 4,
  },

  // ---------- portfolio (only appear in the autoplaying stage) ----------
  {
    slug: "ecommerce",
    title: "e-commerce build",
    blurb: "next.js + stripe storefront, fabric.js designer, invoice flow live.",
    image: "/projects/ecommerce/hero.webp",
    tags: ["client", "web", "stripe"],
    kind: "portfolio",
    status: "live",
    order: 10,
  },
  {
    slug: "fitness",
    title: "fitness studio",
    blurb: "membership site, class schedule, branded booking flow.",
    image: "/projects/fitness/hero.webp",
    tags: ["client", "web", "membership"],
    kind: "portfolio",
    status: "live",
    order: 11,
  },
  {
    slug: "restaurant",
    title: "restaurant",
    blurb: "online menu, ordering, admin dashboard — fozzies.com.",
    image: "/projects/restaurant/hero.webp",
    tags: ["client", "web", "admin"],
    kind: "portfolio",
    status: "live",
    order: 12,
  },
  {
    slug: "group-home",
    title: "group home",
    blurb: "assisted-living intake + tour-form, brand system, seo baseline.",
    image: "/projects/group-home/hero.webp",
    tags: ["client", "web", "intake"],
    kind: "portfolio",
    status: "live",
    order: 13,
  },
  {
    slug: "trading-bot",
    title: "trading bot",
    blurb: "strategy → backtest → live runner with a public journal feed.",
    image: "/projects/trading-bot/hero.webp",
    tags: ["client", "web", "trading"],
    kind: "portfolio",
    status: "live",
    order: 14,
  },
];
