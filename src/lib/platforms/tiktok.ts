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

// Raw shape is intentionally loose — actor output varies across TikTok scrapers
// (clockworks/tiktok-scraper, apidojo/tiktok-scraper). normalize() reads the
// common superset defensively.
type RawTikTokItem = {
  id?: string | number;
  text?: string;
  desc?: string;
  createTimeISO?: string;
  createTime?: number; // unix seconds
  webVideoUrl?: string;
  diggCount?: number;
  playCount?: number;
  commentCount?: number;
  shareCount?: number;
  hashtags?: Array<{ name?: string } | string>;
  videoMeta?: {
    duration?: number;
    downloadAddr?: string;
    subtitleLinks?: Array<{ language?: string; downloadLink?: string }>;
  };
  authorMeta?: {
    name?: string;
    nickName?: string;
    fans?: number;
    signature?: string;
    avatar?: string;
  };
};

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

function hashtagNames(raw: RawTikTokItem["hashtags"]): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((h) => (typeof h === "string" ? h : h?.name))
    .filter((n): n is string => Boolean(n));
}

function postedAtISO(item: RawTikTokItem): string | null {
  if (item.createTimeISO) return item.createTimeISO;
  if (typeof item.createTime === "number")
    return new Date(item.createTime * 1000).toISOString();
  return null;
}

export const tiktokAdapter: PlatformAdapter = {
  platform: "tiktok",

  parseProfileUrl(url) {
    try {
      const u = new URL(url.trim());
      if (!/(^|\.)tiktok\.com$/.test(u.hostname)) return null;
      // https://www.tiktok.com/@handle  (optionally /video/123…)
      const seg = u.pathname.split("/").filter(Boolean);
      const at = seg.find((s) => s.startsWith("@"));
      if (at) return { handle: at.slice(1) };
      return null;
    } catch {
      return null;
    }
  },

  async startScrape(handle, caps: ScrapeCaps): Promise<StartScrapeResult> {
    if (process.env.MOCK_APIFY === "1") {
      const file = path.join(process.cwd(), "fixtures", "apify", "tiktok.json");
      const items = JSON.parse(await readFile(file, "utf8")) as unknown[];
      return { items: items.slice(0, caps.maxVideos) };
    }
    // Real run: start the actor asynchronously; completion arrives via the
    // Apify webhook (app/api/webhooks/apify) or the polling fallback.
    const { ApifyClient } = await import("apify-client");
    const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
    const actorId = process.env.APIFY_TIKTOK_ACTOR ?? "clockworks/tiktok-scraper";
    const run = await client.actor(actorId).start({
      profiles: [handle],
      resultsPerPage: caps.maxVideos,
      shouldDownloadSubtitles: true,
      shouldDownloadVideos: false,
    });
    return { apifyRunId: run.id };
  },

  normalize(items): NormalizedScrape {
    const raw = (items as RawTikTokItem[]).filter(Boolean);
    const author = raw.find((i) => i.authorMeta)?.authorMeta;
    const videos: NormalizedVideo[] = raw
      .filter((i) => i.id != null)
      .map((i) => {
        const sub = i.videoMeta?.subtitleLinks?.find((s) => s.downloadLink);
        return {
          platformVideoId: String(i.id),
          url: i.webVideoUrl ?? "",
          caption: i.text ?? i.desc ?? "",
          hashtags: hashtagNames(i.hashtags),
          postedAt: postedAtISO(i),
          views: num(i.playCount),
          likes: num(i.diggCount),
          commentsCount: num(i.commentCount),
          shares: num(i.shareCount),
          durationSeconds: num(i.videoMeta?.duration),
          mediaUrl: i.videoMeta?.downloadAddr,
          captionTrackUrl: sub?.downloadLink,
        };
      });
    return {
      profile: {
        platform: "tiktok",
        handle: author?.name ?? "",
        displayName: author?.nickName,
        bio: author?.signature,
        followerCount: num(author?.fans) ?? undefined,
        avatarUrl: author?.avatar,
      },
      videos,
    };
  },

  transcriptStrategy(video): TranscriptStrategy {
    if (video.captionTrackUrl) return "caption-track";
    if (video.mediaUrl) return "whisper";
    return "transcript-actor";
  },
};
