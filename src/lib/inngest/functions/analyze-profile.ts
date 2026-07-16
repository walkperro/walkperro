import {
  inngest,
  EVENTS,
  type AnalyzeRequested,
  type ApifyRunFinished,
} from "@/lib/inngest/client";
import { admin } from "@/lib/supabase/admin";
import { getAdapter, type NormalizedScrape } from "@/lib/platforms";

// The analyze pipeline: scrape → (transcribe → extract → synthesize voice →
// cluster opportunities). This scaffold implements scrape + normalize + store
// and writes progress to pipeline_runs for the wow-screen. Transcription,
// Haiku extraction, voice synthesis, and opportunity clustering are wired in as
// their own steps in the next task (they each become a step.run()).

const MAX_VIDEOS = 50; // free-tier default; enforce plan_limits upstream later

async function setProgress(
  runId: string,
  patch: {
    status?: string;
    stage?: string;
    pct?: number;
    detail?: Record<string, unknown>;
    error?: string;
    finished?: boolean;
  }
) {
  const update: Record<string, unknown> = {};
  if (patch.status) update.status = patch.status;
  if (patch.stage) update.stage = patch.stage;
  if (typeof patch.pct === "number") update.pct = patch.pct;
  if (patch.detail) update.stage_detail = patch.detail;
  if (patch.error) update.error = patch.error;
  if (patch.finished) update.finished_at = new Date().toISOString();
  await admin().from("pipeline_runs").update(update).eq("id", runId);
}

export const analyzeProfile = inngest.createFunction(
  {
    id: "analyze-profile",
    // one live pipeline per creator at a time
    concurrency: { key: "event.data.creatorId", limit: 1 },
    retries: 2,
    triggers: [{ event: EVENTS.analyzeRequested }],
  },
  async ({ event, step }) => {
    const { pipelineRunId, connectedAccountId, platform, handle } =
      event.data as AnalyzeRequested;
    const adapter = getAdapter(platform);

    await step.run("mark-running", () =>
      setProgress(pipelineRunId, { status: "running", stage: "scraping", pct: 5 })
    );

    // Kick off the scrape. MOCK_APIFY returns items inline; a real run returns
    // an Apify run id we wait on via webhook (with a polling fallback later).
    const started = await step.run("start-scrape", () =>
      adapter.startScrape(handle, { maxVideos: MAX_VIDEOS })
    );

    let items: unknown[];
    if ("items" in started) {
      items = started.items;
    } else {
      const finished = await step.waitForEvent("await-apify", {
        event: EVENTS.apifyRunFinished,
        match: "data.runId",
        timeout: "15m",
      });
      if (!finished) {
        await step.run("scrape-timeout", () =>
          setProgress(pipelineRunId, {
            status: "failed",
            stage: "scrape_timeout",
            error: "Apify run did not finish within 15m",
            finished: true,
          })
        );
        return { ok: false, reason: "scrape_timeout" };
      }
      items = await step.run("load-dataset", async () => {
        const { ApifyClient } = await import("apify-client");
        const client = new ApifyClient({ token: process.env.APIFY_TOKEN });
        const datasetId = (finished.data as ApifyRunFinished).datasetId;
        if (!datasetId) return [];
        const { items: rows } = await client.dataset(datasetId).listItems();
        return rows as unknown[];
      });
    }

    const scrape: NormalizedScrape = await step.run("normalize", () =>
      Promise.resolve(adapter.normalize(items))
    );

    await step.run("store-videos", async () => {
      const db = admin();
      // refresh the connected account profile snapshot
      await db
        .from("connected_accounts")
        .update({
          bio: scrape.profile.bio ?? null,
          follower_count: scrape.profile.followerCount ?? null,
          avatar_url: scrape.profile.avatarUrl ?? null,
          last_scraped_at: new Date().toISOString(),
        })
        .eq("id", connectedAccountId);

      if (scrape.videos.length > 0) {
        await db.from("source_videos").upsert(
          scrape.videos.map((v) => ({
            connected_account_id: connectedAccountId,
            platform_video_id: v.platformVideoId,
            url: v.url,
            caption: v.caption,
            hashtags: v.hashtags,
            posted_at: v.postedAt,
            views: v.views,
            likes: v.likes,
            comments_count: v.commentsCount,
            shares: v.shares,
            duration_seconds: v.durationSeconds,
          })),
          { onConflict: "connected_account_id,platform_video_id" }
        );
      }

      await setProgress(pipelineRunId, {
        stage: "scraped",
        pct: 40,
        detail: { videos_found: scrape.videos.length },
      });
    });

    // TODO(next task): transcribe (caption-track/actor/Whisper), Haiku
    // extraction, Sonnet voice synthesis, opportunity clustering — each a
    // step.run() updating stage_detail (transcribed/analyzed counts).

    await step.run("mark-succeeded", () =>
      setProgress(pipelineRunId, {
        status: "succeeded",
        stage: "done",
        pct: 100,
        finished: true,
      })
    );

    return { ok: true, videos: scrape.videos.length };
  }
);
