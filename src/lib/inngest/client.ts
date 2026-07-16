import { Inngest } from "inngest";
import type { SocialPlatform } from "@/lib/supabase/types";

// Inngest v4 client. Each step of a pipeline is a separate Vercel invocation
// (durable), so multi-minute scrape→analyze→generate runs never fight the
// function duration limit.
export const inngest = new Inngest({ id: "walkperro" });

// Event data shapes. Inngest v4 types events per-trigger via Standard Schema;
// for now we keep events loosely typed on the wire and cast to these shapes at
// send/receive sites for local type safety.
export type AnalyzeRequested = {
  creatorId: string;
  connectedAccountId: string;
  pipelineRunId: string;
  platform: SocialPlatform;
  handle: string;
};
export type ApifyRunFinished = {
  runId: string;
  status: string;
  datasetId?: string;
};
export type ProductGenerateRequested = {
  creatorId: string;
  productId: string;
  opportunityId: string;
};
export type StripeAccountActivated = { creatorId: string };
export type RefreshScanRequested = {
  creatorId: string;
  connectedAccountId: string;
};

export const EVENTS = {
  analyzeRequested: "pipeline/analyze.requested",
  apifyRunFinished: "apify/run.finished",
  productGenerateRequested: "product/generate.requested",
  stripeAccountActivated: "stripe/account.activated",
  refreshScanRequested: "refresh/scan.requested",
} as const;
