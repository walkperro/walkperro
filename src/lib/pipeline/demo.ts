import { tiktokAdapter } from "@/lib/platforms/tiktok";
import type { NormalizedScrape } from "@/lib/platforms/types";

// Credential-free demo pipeline. Runs the real TikTok adapter against fixtures
// (MOCK_APIFY) and derives product opportunities with a transparent heuristic —
// no LLM, no DB, no network. This drives the public /demo wow-screen so the
// "paste → analysis → product ideas" flow is visible without any keys. In
// production the same shape is produced by the AI opportunity-clustering step.

export type DemoOpportunity = {
  id: string;
  title: string;
  angle: string;
  description: string;
  demandScore: number; // 0-100, relative to the creator's best cluster
  evidence: {
    videoCount: number;
    totalViews: number;
    tags: string[];
    topVideoUrl: string;
  };
};

export type DemoAnalysis = {
  profile: {
    handle: string;
    displayName: string | null;
    followerCount: number | null;
    avatarUrl: string | null;
    bio: string | null;
  };
  videoCount: number;
  transcriptCount: number;
  totalViews: number;
  opportunities: DemoOpportunity[];
};

// Tags too generic to name a product around (they describe format, not topic).
const STOP_TAGS = new Set(["busy", "lazy", "fyp", "foryou", "viral"]);

// Hand-tuned titles for the demo creator's niche; falls back to a template.
const TITLE_MAP: Record<string, { title: string; angle: string }> = {
  highprotein: {
    title: "the high-protein meal prep playbook",
    angle: "your most-watched angle — hitting protein without living in the kitchen",
  },
  budget: {
    title: "the $50 grocery week",
    angle: "a full week of prep for less than two takeout orders",
  },
  grocery: {
    title: "the $50 grocery week",
    angle: "the exact list, store by store, under budget",
  },
  snacks: {
    title: "5 high-protein snacks to stop buying",
    angle: "make the bars and bites you keep repurchasing",
  },
  breakfast: {
    title: "sunday-night breakfast prep",
    angle: "five grab-and-go breakfasts that survive the week",
  },
  macros: {
    title: "hit your macros without counting",
    angle: "the plate formula you keep teaching in the comments",
  },
  cutting: {
    title: "meal prep for a cut",
    angle: "exactly what you eat when you're leaning out",
  },
  aldi: {
    title: "the aldi cart",
    angle: "the full-week haul from one store",
  },
};

function fmtViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`;
  return String(n);
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}

export function buildDemoAnalysis(scrape: NormalizedScrape): DemoAnalysis {
  const videos = scrape.videos;
  const totalViews = videos.reduce((a, v) => a + (v.views ?? 0), 0);
  const transcriptCount = videos.filter(
    (v) => tiktokAdapter.transcriptStrategy(v) === "caption-track"
  ).length;

  // Cluster by hashtag. The single most frequent tag is the niche itself
  // (e.g. "mealprep") — keep it for grouping but don't name a product after it.
  const freq = new Map<string, number>();
  for (const v of videos)
    for (const t of v.hashtags) freq.set(t, (freq.get(t) ?? 0) + 1);
  const nicheTag = [...freq.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];

  type Cluster = { tag: string; views: number; ids: Set<string>; topUrl: string; topViews: number };
  const clusters = new Map<string, Cluster>();
  for (const v of videos) {
    for (const tag of v.hashtags) {
      if (tag === nicheTag || STOP_TAGS.has(tag)) continue;
      const c =
        clusters.get(tag) ??
        { tag, views: 0, ids: new Set<string>(), topUrl: "", topViews: 0 };
      c.views += v.views ?? 0;
      c.ids.add(v.platformVideoId);
      if ((v.views ?? 0) > c.topViews) {
        c.topViews = v.views ?? 0;
        c.topUrl = v.url;
      }
      clusters.set(tag, c);
    }
  }

  const ranked = [...clusters.values()]
    .filter((c) => c.ids.size >= 2) // needs recurring evidence
    .sort((a, b) => b.views - a.views);

  const maxViews = ranked[0]?.views ?? 1;
  const seenTitles = new Set<string>();
  const opportunities: DemoOpportunity[] = [];

  for (const c of ranked) {
    const mapped = TITLE_MAP[c.tag] ?? {
      title: `the ${c.tag} playbook`,
      angle: `your recurring take on ${c.tag}`,
    };
    if (seenTitles.has(mapped.title)) continue; // dedupe budget/grocery overlap
    seenTitles.add(mapped.title);
    opportunities.push({
      id: slugify(mapped.title),
      title: mapped.title,
      angle: mapped.angle,
      description: `built from ${c.ids.size} of your videos on ${c.tag} — ${fmtViews(
        c.views
      )} combined views on this angle.`,
      demandScore: Math.round((c.views / maxViews) * 100),
      evidence: {
        videoCount: c.ids.size,
        totalViews: c.views,
        tags: [c.tag],
        topVideoUrl: c.topUrl,
      },
    });
    if (opportunities.length >= 5) break;
  }

  return {
    profile: {
      handle: scrape.profile.handle,
      displayName: scrape.profile.displayName ?? null,
      followerCount: scrape.profile.followerCount ?? null,
      avatarUrl: scrape.profile.avatarUrl ?? null,
      bio: scrape.profile.bio ?? null,
    },
    videoCount: videos.length,
    transcriptCount,
    totalViews,
    opportunities,
  };
}
