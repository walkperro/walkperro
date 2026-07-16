import { z } from "zod";
import { MODELS, generateJSON } from "./client";
import type { VideoExtraction } from "./extract-video";

// Voice synthesis (Sonnet 5). Folds all per-video extractions + bio into a
// structured voice profile AND a deterministic, byte-stable prompt prefix that
// is cached across the 10–12 asset generations per product (0.1x cache reads).

export const VoiceProfileSchema = z.object({
  tone: z.array(z.string()),
  vocabulary: z.array(z.string()),
  catchphrases: z.array(z.string()),
  point_of_view: z.string(),
  audience: z.string(),
  dos: z.array(z.string()),
  donts: z.array(z.string()),
  example_lines: z.array(z.string()),
});
export type VoiceProfileData = z.infer<typeof VoiceProfileSchema>;

const VOICE_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    tone: { type: "array", items: { type: "string" } },
    vocabulary: { type: "array", items: { type: "string" } },
    catchphrases: { type: "array", items: { type: "string" } },
    point_of_view: { type: "string" },
    audience: { type: "string" },
    dos: { type: "array", items: { type: "string" } },
    donts: { type: "array", items: { type: "string" } },
    example_lines: { type: "array", items: { type: "string" } },
  },
  required: [
    "tone",
    "vocabulary",
    "catchphrases",
    "point_of_view",
    "audience",
    "dos",
    "donts",
    "example_lines",
  ],
};

const SYSTEM =
  "You are a voice analyst. From a creator's video signal and bio, produce a precise, reusable voice profile. Ground every field in the provided material — example_lines must be near-verbatim from transcripts/captions, not invented.";

export async function synthesizeVoiceProfile(input: {
  bio: string | null;
  extractions: VideoExtraction[];
}): Promise<VoiceProfileData> {
  const rolled = {
    topics: input.extractions.flatMap((e) => e.topics),
    advice: input.extractions.flatMap((e) => e.advice_given),
    hooks: input.extractions.flatMap((e) => e.hooks),
    phrases: input.extractions.flatMap((e) => e.recurring_phrases),
    questions: input.extractions.flatMap((e) => e.audience_questions),
    tone: input.extractions.flatMap((e) => e.tone_markers),
  };
  const user = [
    `BIO: ${input.bio ?? "(none)"}`,
    `TONE MARKERS: ${rolled.tone.join(", ")}`,
    `RECURRING PHRASES: ${rolled.phrases.join(" | ")}`,
    `HOOKS: ${rolled.hooks.slice(0, 40).join(" | ")}`,
    `ADVICE SAMPLES: ${rolled.advice.slice(0, 60).join(" | ")}`,
    `AUDIENCE QUESTIONS: ${rolled.questions.slice(0, 40).join(" | ")}`,
  ].join("\n\n");

  return generateJSON({
    model: MODELS.synthesis,
    system: SYSTEM,
    user,
    schema: VoiceProfileSchema,
    jsonSchema: VOICE_JSON_SCHEMA,
    schemaName: "voice_profile",
    maxTokens: 2048,
  });
}

/**
 * Render a deterministic (no timestamps / random ordering) prompt prefix used
 * as the cached system block across all downstream asset generation. Byte
 * stability is required for prompt caching; pad above the model's minimum
 * cacheable prefix (4096 tokens on Opus 4.8) in the caller if needed.
 */
export function renderPromptPrefix(v: VoiceProfileData): string {
  const list = (label: string, items: string[]) =>
    `${label}:\n${items.map((i) => `- ${i}`).join("\n")}`;
  return [
    "You are ghost-writing a digital product in a specific creator's voice.",
    "Match this voice exactly. Do not drift into generic self-help phrasing.",
    "",
    list("TONE", v.tone),
    "",
    list("VOCABULARY THE CREATOR USES", v.vocabulary),
    "",
    list("CATCHPHRASES (use sparingly, only where natural)", v.catchphrases),
    "",
    `POINT OF VIEW: ${v.point_of_view}`,
    `AUDIENCE: ${v.audience}`,
    "",
    list("DO", v.dos),
    "",
    list("DON'T", v.donts),
    "",
    list("EXAMPLE LINES IN THE CREATOR'S ACTUAL VOICE", v.example_lines),
    "",
    "HARD RULES: Never fabricate statistics, studies, credentials, medical/financial/earnings claims, or guarantees. Every concrete claim must trace to the creator's own content. When unsure, teach the method, not a promised outcome.",
  ].join("\n");
}
