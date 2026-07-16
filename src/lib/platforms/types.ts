// Platform-adapter contract. The scrape→transcribe→analyze pipeline is written
// once against this interface so all three platforms flow through one path.

export type Platform = "tiktok" | "instagram" | "youtube";

export type NormalizedVideo = {
  platformVideoId: string;
  url: string;
  caption: string;
  hashtags: string[];
  postedAt: string | null; // ISO 8601
  views: number | null;
  likes: number | null;
  commentsCount: number | null;
  shares: number | null;
  durationSeconds: number | null;
  mediaUrl?: string; // direct A/V URL for Whisper fallback
  captionTrackUrl?: string; // subtitle/caption file URL if the platform exposes one
};

export type ProfileMeta = {
  platform: Platform;
  handle: string;
  displayName?: string;
  bio?: string;
  followerCount?: number;
  avatarUrl?: string;
};

export type NormalizedScrape = {
  profile: ProfileMeta;
  videos: NormalizedVideo[];
};

export type ScrapeCaps = {
  maxVideos: number;
};

// Either an async Apify run was started (poll/webhook for completion) or, in
// MOCK mode / for API-based platforms, items were returned inline.
export type StartScrapeResult =
  | { apifyRunId: string }
  | { items: unknown[] };

export type TranscriptStrategy =
  | "caption-track" // download the platform's own subtitle file (cheapest)
  | "transcript-actor" // a dedicated transcript scraper
  | "whisper" // transcribe the audio ourselves (most expensive)
  | "skip";

export interface PlatformAdapter {
  readonly platform: Platform;
  /** Parse a profile URL into a handle, or null if it isn't this platform. */
  parseProfileUrl(url: string): { handle: string } | null;
  /** Kick off scraping. Honors MOCK_APIFY=1 (reads fixtures). */
  startScrape(handle: string, caps: ScrapeCaps): Promise<StartScrapeResult>;
  /** Normalize raw actor/API items into our shape. Pure + unit-testable. */
  normalize(items: unknown[]): NormalizedScrape;
  /** Choose the cheapest viable transcript route for a given video. */
  transcriptStrategy(video: NormalizedVideo): TranscriptStrategy;
}
