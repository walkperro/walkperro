import Anthropic from "@anthropic-ai/sdk";
import type { z } from "zod";

// Anthropic client + model tiers for the generation pipeline. Kept separate
// from src/lib/claude.ts (the raw-fetch Telegram-bot client), which stays.
//
// Haiku 4.5  — per-video extraction (cheap, parallel)
// Sonnet 5   — voice synthesis, opportunity clustering, most assets
// Opus 4.8   — the flagship guide body only (must not read as AI slop)

export const MODELS = {
  extraction: "claude-haiku-4-5",
  synthesis: "claude-sonnet-5",
  flagship: "claude-opus-4-8",
} as const;

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("Missing ANTHROPIC_API_KEY");
  _client = new Anthropic({ apiKey });
  return _client;
}

export type SystemBlock = {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral"; ttl?: "5m" | "1h" };
};

/**
 * Structured generation via the Messages API's json_schema output format.
 * We pass an explicit JSON Schema (API-valid: additionalProperties:false +
 * required) and validate the returned JSON against the matching zod schema —
 * version-safe across zod releases and independent of the SDK zod helper.
 */
export async function generateJSON<T>(opts: {
  model: string;
  system: string | SystemBlock[];
  user: string;
  schema: z.ZodType<T>;
  jsonSchema: Record<string, unknown>;
  schemaName: string;
  maxTokens?: number;
}): Promise<T> {
  const res = await anthropic().messages.create({
    model: opts.model,
    max_tokens: opts.maxTokens ?? 4096,
    system: opts.system,
    messages: [{ role: "user", content: opts.user }],
    output_config: {
      format: {
        type: "json_schema",
        name: opts.schemaName,
        schema: opts.jsonSchema,
      },
    },
  } as Anthropic.MessageCreateParamsNonStreaming);

  if (res.stop_reason === "refusal") {
    throw new Error("Anthropic declined the request (stop_reason: refusal)");
  }
  const text = res.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");
  return opts.schema.parse(JSON.parse(text));
}
