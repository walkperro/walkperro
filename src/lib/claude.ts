// Anthropic Claude API client (lightweight — uses fetch, no SDK dep).
// Server-only.

const API = "https://api.anthropic.com/v1/messages";
const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5";
const DEFAULT_MAX_TOKENS = Number(process.env.ANTHROPIC_MAX_TOKENS) || 2048;

export type ClaudeMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClaudeReplyResult = {
  text: string;
  inputTokens?: number;
  outputTokens?: number;
};

export async function claudeReply(opts: {
  system?: string;
  messages: ClaudeMessage[];
  model?: string;
  maxTokens?: number;
}): Promise<ClaudeReplyResult> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new Error("Missing ANTHROPIC_API_KEY");

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: opts.model || DEFAULT_MODEL,
      max_tokens: opts.maxTokens || DEFAULT_MAX_TOKENS,
      system: opts.system,
      messages: opts.messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Claude API ${res.status}: ${body.slice(0, 400)}`);
  }

  const body = await res.json();
  // Response shape: { content: [{ type: 'text', text: '...' }, ...], usage: {...} }
  const text =
    (body.content || [])
      .filter((c: { type: string }) => c.type === "text")
      .map((c: { text: string }) => c.text)
      .join("\n") || "(empty reply)";

  return {
    text,
    inputTokens: body.usage?.input_tokens,
    outputTokens: body.usage?.output_tokens,
  };
}
