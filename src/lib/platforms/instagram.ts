import { readFile } from "node:fs/promises";
import path from "node:path";
import type {
  NormalizedScrape,
  NormalizedVideo,
  PlatformAdapter,
  ScrapeCaps,
  StartScrapeResult,
  TranscriptStrategy,
} from "./types";

// Instagram is the most anti-bot platform and its Apify actors break in bulk;
// treat it as a fast-follow with graceful degradation and cost-abort on failed
// runs. Reels rarely expose caption files, so transcripts are mostly Whisper.
// This scaffolds parse/normalize/strategy; live scrape is Phase 4.
type RawInstagramItem = {
  id?: string;
  shortCode?: string;
  caption?: string;
  timestamp?: string;
  url?: string;
  videoViewCount?: number;
  likesCount?: number;
  commentsCount?: number;
  videoDuration?: number;
  videoUrl?: string;
  hashtags?: string[];
  ownerUsername?: string;
  ownerFullName?: string;
  owner?: { username?: string; fullName?: string; followersCount?: number; profilePicUrl?: string; biography?: string };
};

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export const instagramAdapter: PlatformAdapter = {
  platform: "instagram",

  parseProfileUrl(url) {
    try {
      const u = new URL(url.trim());
      if (!/(^|\.)instagram\.com$/.test(u.hostname)) return null;
      const seg = u.pathname.split("/").filter(Boolean);
      const reserved = new Set(["p", "reel", "reels", "explore", "stories", "tv"]);
      if (seg[0] && !reserved.has(seg[0])) return { handle: seg[0] };
      return null;
    } catch {
      return null;
    }
  },

  async startScrape(_handle, caps: ScrapeCaps): Promise<StartScrapeResult> {
    if (process.env.MOCK_APIFY === "1") {
      const file = path.join(process.cwd(), "fixtures", "apify", "instagram.json");
      const items = JSON.parse(await readFile(file, "utf8")) as unknown[];
      return { items: items.slice(0, caps.maxVideos) };
    }
    throw new Error(
      "Instagram live scrape not implemented yet (Phase 4): profile + reels scrapers, Whisper-heavy transcripts, cost-abort on failed runs."
    );
  },

  normalize(items): NormalizedScrape {
    const raw = (items as RawInstagramItem[]).filter(Boolean);
    const owner = raw.find((i) => i.owner)?.owner;
    const ownerName = owner?.username ?? raw.find((i) => i.ownerUsername)?.ownerUsername;
    const videos: NormalizedVideo[] = raw
      .map((i) => {
        const vid = i.id ?? i.shortCode;
        if (!vid) return null;
        const v: NormalizedVideo = {
          platformVideoId: String(vid),
          url: i.url ?? (i.shortCode ? `https://www.instagram.com/reel/${i.shortCode}/` : ""),
          caption: i.caption ?? "",
          hashtags: Array.isArray(i.hashtags) ? i.hashtags : [],
          postedAt: i.timestamp ?? null,
          views: num(i.videoViewCount),
          likes: num(i.likesCount),
          commentsCount: num(i.commentsCount),
          shares: null,
          durationSeconds: num(i.videoDuration),
          mediaUrl: i.videoUrl,
        };
        return v;
      })
      .filter((v): v is NormalizedVideo => v !== null);
    return {
      profile: {
        platform: "instagram",
        handle: ownerName ?? "",
        displayName: owner?.fullName ?? raw.find((i) => i.ownerFullName)?.ownerFullName,
        bio: owner?.biography,
        followerCount: num(owner?.followersCount) ?? undefined,
        avatarUrl: owner?.profilePicUrl,
      },
      videos,
    };
  },

  transcriptStrategy(video): TranscriptStrategy {
    if (video.mediaUrl) return "whisper";
    return "skip";
  },
};
