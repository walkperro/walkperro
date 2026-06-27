// 10 website templates Walk can build for clients. Source of truth for the
// /websites catalog. Each entry maps a thumbnail (sourced from xwhystudio.com
// and re-hosted under /public/websites/<slug>/thumb.webp) to a category, a
// short blurb, and a live URL when one exists.
//
// Walk's brief: ship the same templates as xwhystudio.com MINUS the four that
// came from the Fiverr profile (online store / fitness saas / learning
// platform / networking app). The 10 below are the keeper set.

export type WebsiteTemplate = {
  slug: string;
  title: string;                 // display title, voice-clean (lowercase)
  category: "service" | "ecommerce" | "web-app";
  blurb: string;                 // one sentence, lowercase
  thumb: string;                 // /websites/<slug>/thumb.webp
  liveUrl?: string;              // a real client site running this template
  tags: string[];                // 1-3 short tags
  order: number;
};

export const WEBSITES: WebsiteTemplate[] = [
  {
    slug: "restaurant",
    title: "restaurant",
    category: "service",
    blurb: "menu + reservations + a brand that makes people show up.",
    thumb: "/websites/restaurant/thumb.webp",
    liveUrl: "https://fozziesdining.com",
    tags: ["brand", "reservations"],
    order: 1,
  },
  {
    slug: "ecommerce",
    title: "online store",
    category: "ecommerce",
    blurb: "storefront, cart, stripe checkout, admin. ship today, sell tomorrow.",
    thumb: "/websites/ecommerce/thumb.webp",
    liveUrl: "https://gaprinthub.vercel.app",
    tags: ["storefront", "stripe"],
    order: 2,
  },
  {
    slug: "personal-training",
    title: "personal training",
    category: "service",
    blurb: "coaching site with booking, classes, and a real conversion path.",
    thumb: "/websites/personal-training/thumb.webp",
    liveUrl: "https://summerloffler.com",
    tags: ["coaching", "booking"],
    order: 3,
  },
  {
    slug: "ai-directory",
    title: "ai directory",
    category: "web-app",
    blurb: "indexed listings + admin + seo baked in. niche it down, watch it rank.",
    thumb: "/websites/ai-directory/thumb.webp",
    liveUrl: "https://aitoolsort.com",
    tags: ["directory", "seo"],
    order: 4,
  },
  {
    slug: "group-home",
    title: "group home & care",
    category: "service",
    blurb: "intake forms, tour requests, brand-locked. built for trust.",
    thumb: "/websites/group-home/thumb.webp",
    liveUrl: "https://lighthouserhc.com",
    tags: ["healthcare", "accessible"],
    order: 5,
  },
  {
    slug: "clinic",
    title: "clinic platform",
    category: "web-app",
    blurb: "patient portal + appointments + dashboard. healthcare done right.",
    thumb: "/websites/clinic/thumb.webp",
    tags: ["healthcare", "dashboard"],
    order: 6,
  },
  {
    slug: "roofing",
    title: "roofing",
    category: "service",
    blurb: "lead-gen first. quotes in, calls booked, trust signals everywhere.",
    thumb: "/websites/roofing/thumb.webp",
    tags: ["lead-gen", "trust"],
    order: 7,
  },
  {
    slug: "hvac",
    title: "hvac",
    category: "service",
    blurb: "local seo + conversion-driven. show up first, close on the phone.",
    thumb: "/websites/hvac/thumb.webp",
    tags: ["local seo", "conversion"],
    order: 8,
  },
  {
    slug: "plumbing",
    title: "plumbing",
    category: "service",
    blurb: "lead-gen funnel built for a 5-mile radius. dispatch-ready.",
    thumb: "/websites/plumbing/thumb.webp",
    tags: ["local seo", "lead-gen"],
    order: 9,
  },
  {
    slug: "landscaping",
    title: "landscaping",
    category: "service",
    blurb: "gallery-first, fast quotes, branded estimates. wins on the photo.",
    thumb: "/websites/landscaping/thumb.webp",
    tags: ["gallery", "quotes"],
    order: 10,
  },
];
