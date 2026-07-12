// The showroom — single source of truth for the homepage tour (WebGL corridor
// + server-rendered grid). Items compose by slug reference from websites.ts
// (client-facing templates) and projects.ts (flagship products) rather than
// duplicating copy; each entry adds only what the showroom needs.
//
// demoUrl semantics:
//   • absent            → card CTA says "get this built →" only
//   • a live prod site  → "view live →" (until the DEMO_MODE deploy exists)
//   • a *.demo url      → "walk through it →" (Phase 2+ swaps these in)
//
// Plan: /Users/ironclaw/.claude/plans/walkperro-admin-declarative-giraffe.md

import { getWebsiteBySlug } from "@/lib/websites";
import type { WebsiteTemplate } from "@/content/websites";

export type ShowroomItem = {
  slug: string;                  // matches websites.ts slug when a template exists
  title: string;
  category: string;              // display label
  tourLine: string;              // one-liner shown in the corridor overlay
  image: string;                 // 16:10 texture / card image
  demoUrl?: string;              // live site or demo deployment
  demoKind?: "live" | "demo";    // affects CTA label
  videoSrc?: string;             // /showroom/reels/<slug>.webm (Phase 5)
  inquireSlug?: string;          // /websites/<slug> for "get this built" (defaults to slug)
  order: number;
};

// Helper: build an item on top of a websites.ts template entry.
function fromTemplate(
  slug: string,
  extra: Partial<ShowroomItem> & { tourLine: string; order: number }
): ShowroomItem {
  const t = getWebsiteBySlug(slug) as WebsiteTemplate;
  return {
    slug,
    title: t.title,
    category: t.category === "web-app" ? "web app" : t.category === "ecommerce" ? "e-commerce" : "service site",
    image: t.thumb,
    demoUrl: t.liveUrl,
    demoKind: t.liveUrl ? "live" : undefined,
    ...extra,
  };
}

export const SHOWROOM: ShowroomItem[] = [
  fromTemplate("restaurant", {
    tourLine: "reservations, menus, a brand people dress up for. admin runs the floor.",
    demoUrl: "https://demo-fozzies.vercel.app",
    demoKind: "demo",
    order: 1,
  }),
  fromTemplate("ecommerce", {
    tourLine: "eight storefronts, a live product designer, checkout that closes.",
    demoUrl: "https://demo-shirtshop.vercel.app",
    demoKind: "demo",
    order: 2,
  }),
  {
    slug: "closehound",
    title: "closehound",
    category: "saas",
    tourLine: "screens every listing in a state for sec8 deals where rent beats the mortgage.",
    image: "/projects/closehound/hero.webp",
    demoUrl: "https://demo-closehound.vercel.app",
    demoKind: "demo",
    inquireSlug: "ai-directory", // closest buildable template until a saas template page exists
    order: 3,
  },
  fromTemplate("personal-training", {
    tourLine: "coaching, class booking, payments — a business that runs while she trains.",
    order: 4,
  }),
  fromTemplate("group-home", {
    tourLine: "placement inquiries in, tour requests booked, every lead tracked in the admin.",
    order: 5,
  }),
  {
    slug: "lhrc",
    title: "rehab center",
    category: "service site",
    tourLine: "a healthcare brand with intake flows and an email engine behind it.",
    image: "/websites/group-home/thumb.webp", // placeholder until LHRC hero shot lands
    demoUrl: "https://lighthouserhc.com",
    demoKind: "live",
    inquireSlug: "group-home",
    order: 6,
  },
  fromTemplate("ai-directory", {
    tourLine: "indexed listings, admin, seo baked in. niche it down and watch it rank.",
    order: 7,
  }),
  {
    slug: "bayoubids",
    title: "bayou bids",
    category: "portal",
    tourLine: "a daily-refreshed board of government bids, pulled straight from sam.gov.",
    image: "/projects/1k2rich/hero.webp", // placeholder — bayoubids hero shot in Phase 2
    demoUrl: "https://demo-bayoubids.vercel.app",
    demoKind: "demo",
    inquireSlug: "ai-directory",
    order: 8,
  },
  {
    slug: "cuban-study",
    title: "language app",
    category: "web app",
    tourLine: "spaced-repetition flashcards, drills, memory palaces — real edtech.",
    image: "/projects/asere/hero.webp",
    demoUrl: "https://demo-cuban-study.vercel.app",
    demoKind: "demo",
    inquireSlug: "ai-directory",
    order: 9,
  },
  {
    slug: "1k2rich",
    title: "trading bot journal",
    category: "web app",
    tourLine: "a $1k bankroll traded by a bot, every position public. i build these to spec.",
    image: "/projects/1k2rich/hero.webp",
    demoUrl: "https://1k2rich.vercel.app",
    demoKind: "live",
    inquireSlug: "ai-directory",
    order: 10,
  },
  fromTemplate("roofing", {
    tourLine: "lead-gen first: quotes in, calls booked, trust signals everywhere.",
    demoUrl: "https://demo-roofing-zeta.vercel.app",
    demoKind: "demo",
    order: 11,
  }),
  fromTemplate("landscaping", {
    tourLine: "gallery-first with fast quotes. wins on the photo.",
    demoUrl: "https://demo-landscaping-amber.vercel.app",
    demoKind: "demo",
    order: 12,
  }),
];

export function getShowroomItems(): ShowroomItem[] {
  return [...SHOWROOM]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      // Every showroom texture gets a ken-burns reel from
      // scripts/build-showroom-reels.mjs — same slug, same path contract.
      // Explicit videoSrc (future real screen recordings) wins.
      videoSrc: `/showroom/reels/${item.slug}.webm`,
      ...item,
    }));
}
