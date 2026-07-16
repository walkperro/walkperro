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

// YouTube metadata comes from the Data API v3 (free quota), NOT Apify. Captions
// are fetched via a paid transcript actor with a Whisper fallback — caption
// tracks are NOT free (the Data API only returns captions for videos you own,
// and third-party timedtext scraping is IP/PoToken-blocked). Full pipeline is
// Phase 4; this scaffolds parse/normalize/strategy so the adapter registry and
// fixtures work today.
type RawYouTubeItem = {
  videoId?: string;
  id?: string;
  title?: string;
  description?: string;
  publishedAt?: string;
  url?: string;
  viewCount?: number;
  likeCount?: number;
  commentCount?: number;
  durationSeconds?: number;
  hasCaptions?: boolean;
  captionUrl?: string;
  channel?: { handle?: string; title?: string; subscriberCount?: number; thumbnail?: string; description?: string };
};

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

export const youtubeAdapter: PlatformAdapter = {
  platform: "youtube",

  parseProfileUrl(url) {
    try {
      const u = new URL(url.trim());
      if (!/(^|\.)youtube\.com$/.test(u.hostname) && u.hostname !== "youtu.be")
        return null;
      const seg = u.pathname.split("/").filter(Boolean);
      const at = seg.find((s) => s.startsWith("@"));
      if (at) return { handle: at }; // keep the leading @ for YouTube handles
      if (seg[0] === "channel" && seg[1]) return { handle: seg[1] }; // UC…
      if ((seg[0] === "c" || seg[0] === "user") && seg[1]) return { handle: seg[1] };
      return null;
    } catch {
      return null;
    }
  },

  async startScrape(_handle, caps: ScrapeCaps): Promise<StartScrapeResult> {
    if (process.env.MOCK_APIFY === "1") {
      const file = path.join(process.cwd(), "fixtures", "apify", "youtube.json");
      const items = JSON.parse(await readFile(file, "utf8")) as unknown[];
      return { items: items.slice(0, caps.maxVideos) };
    }
    throw new Error(
      "YouTube live scrape not implemented yet (Phase 4): Data API v3 for metadata + paid caption actor + Whisper fallback."
    );
  },

  normalize(items): NormalizedScrape {
    const raw = (items as RawYouTubeItem[]).filter(Boolean);
    const channel = raw.find((i) => i.channel)?.channel;
    const videos: NormalizedVideo[] = raw
      .map((i) => {
        const vid = i.videoId ?? i.id;
        if (!vid) return null;
        const v: NormalizedVideo = {
          platformVideoId: String(vid),
          url: i.url ?? `https://www.youtube.com/watch?v=${vid}`,
          caption: i.title ?? "",
          hashtags: [],
          postedAt: i.publishedAt ?? null,
          views: num(i.viewCount),
          likes: num(i.likeCount),
          commentsCount: num(i.commentCount),
          shares: null,
          durationSeconds: num(i.durationSeconds),
          captionTrackUrl: i.captionUrl,
        };
        return v;
      })
      .filter((v): v is NormalizedVideo => v !== null);
    return {
      profile: {
        platform: "youtube",
        handle: channel?.handle ?? "",
        displayName: channel?.title,
        bio: channel?.description,
        followerCount: num(channel?.subscriberCount) ?? undefined,
        avatarUrl: channel?.thumbnail,
      },
      videos,
    };
  },

  transcriptStrategy(video): TranscriptStrategy {
    if (video.captionTrackUrl) return "caption-track";
    return "whisper"; // long-form YouTube with no captions is the costly path — cap by top-N views upstream
  },
};
