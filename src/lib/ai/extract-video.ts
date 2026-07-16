import { z } from "zod";
import { MODELS, generateJSON } from "./client";

// Per-video extraction (Haiku 4.5). Distills a single video's transcript +
// caption + hashtags + top comments into structured signal used for voice
// synthesis and opportunity clustering.

export const VideoExtractionSchema = z.object({
  topics: z.array(z.string()),
  advice_given: z.array(z.string()),
  hooks: z.array(z.string()),
  recurring_phrases: z.array(z.string()),
  audience_questions: z.array(z.string()),
  tone_markers: z.array(z.string()),
});
export type VideoExtraction = z.infer<typeof VideoExtractionSchema>;

const EXTRACTION_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    topics: { type: "array", items: { type: "string" } },
    advice_given: { type: "array", items: { type: "string" } },
    hooks: { type: "array", items: { type: "string" } },
    recurring_phrases: { type: "array", items: { type: "string" } },
    audience_questions: { type: "array", items: { type: "string" } },
    tone_markers: { type: "array", items: { type: "string" } },
  },
  required: [
    "topics",
    "advice_given",
    "hooks",
    "recurring_phrases",
    "audience_questions",
    "tone_markers",
  ],
};

const SYSTEM =
  "You extract structured signal from a short-form creator's video. Only report content that is actually present — never invent advice, claims, or phrases the creator did not make. Empty arrays are correct when a field has no support.";

export type VideoInput = {
  caption: string;
  transcript: string | null;
  hashtags: string[];
  topComments?: string[];
};

export async function extractVideo(v: VideoInput): Promise<VideoExtraction> {
  const user = [
    `CAPTION: ${v.caption}`,
    `HASHTAGS: ${v.hashtags.join(", ")}`,
    `TRANSCRIPT: ${v.transcript ?? "(none available)"}`,
    v.topComments?.length ? `TOP COMMENTS: ${v.topComments.join(" | ")}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  return generateJSON({
    model: MODELS.extraction,
    system: SYSTEM,
    user,
    schema: VideoExtractionSchema,
    jsonSchema: EXTRACTION_JSON_SCHEMA,
    schemaName: "video_extraction",
    maxTokens: 1024,
  });
}
