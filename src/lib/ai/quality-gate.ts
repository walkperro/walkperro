import { z } from "zod";
import { MODELS, generateJSON } from "./client";

// Two-layer publish gate:
// 1. A DETERMINISTIC prohibited-claim rules filter (not the AI judge). Because
//    the creator is seller of record and the target niches are FTC-sensitive,
//    regulated-claim language must be caught by hard rules the model can't
//    rationalize away.
// 2. A Sonnet-as-judge rubric for quality (voice match, specificity, etc.).
//    Note: the judge is lenient/self-preferring and CANNOT verify scientific or
//    financial substantiation — that's what layer 1 is for.

// Phrases that assert regulated efficacy / income / medical outcomes. Kept as
// word/phrase patterns; extend per niche. A hit forces human review.
const PROHIBITED_PATTERNS: RegExp[] = [
  /\bguarantee(d|s)?\b/i,
  /\blose \d+\s*(lbs?|pounds|kg)\b/i,
  /\bcure(s|d)?\b/i,
  /\btreat(s|ment)?\s+(your|the)?\s*(disease|illness|condition|anxiety|depression)\b/i,
  /\bclinically proven\b/i,
  /\bfda[- ]approved\b/i,
  /\bmake \$?\d[\d,]*\s*(\/|per )?(day|week|month)\b/i,
  /\bguaranteed (income|returns?|results?)\b/i,
  /\bget rich\b/i,
  /\brisk[- ]free\b/i,
  /\bwill (definitely|certainly) (work|make|earn|lose)\b/i,
];

export type ProhibitedScan = {
  flagged: boolean;
  matches: { pattern: string; excerpt: string }[];
};

export function scanProhibitedClaims(text: string): ProhibitedScan {
  const matches: ProhibitedScan["matches"] = [];
  for (const re of PROHIBITED_PATTERNS) {
    const m = re.exec(text);
    if (m) {
      const start = Math.max(0, m.index - 30);
      matches.push({
        pattern: re.source,
        excerpt: text.slice(start, m.index + m[0].length + 30).trim(),
      });
    }
  }
  return { flagged: matches.length > 0, matches };
}

export const RubricSchema = z.object({
  voice_match: z.number(),
  specificity: z.number(),
  actionability: z.number(),
  structure: z.number(),
  no_fabrication: z.number(),
  notes: z.string(),
});
export type Rubric = z.infer<typeof RubricSchema>;

const RUBRIC_JSON_SCHEMA: Record<string, unknown> = {
  type: "object",
  additionalProperties: false,
  properties: {
    voice_match: { type: "integer" },
    specificity: { type: "integer" },
    actionability: { type: "integer" },
    structure: { type: "integer" },
    no_fabrication: { type: "integer" },
    notes: { type: "string" },
  },
  required: [
    "voice_match",
    "specificity",
    "actionability",
    "structure",
    "no_fabrication",
    "notes",
  ],
};

export type QualityResult = {
  pass: boolean;
  rubric: Rubric;
  prohibited: ProhibitedScan;
};

export async function runQualityGate(
  assetText: string,
  voicePrefix: string
): Promise<QualityResult> {
  const prohibited = scanProhibitedClaims(assetText);

  const rubric = await generateJSON({
    model: MODELS.synthesis,
    system:
      "You are a strict editor scoring a digital product asset 1-10 on each dimension. no_fabrication scores how well every concrete claim traces to genuine expertise (penalize invented stats/studies/guarantees). Be honest; do not inflate.",
    user: `VOICE THE ASSET SHOULD MATCH:\n${voicePrefix}\n\n---\nASSET UNDER REVIEW:\n${assetText}`,
    schema: RubricSchema,
    jsonSchema: RUBRIC_JSON_SCHEMA,
    schemaName: "quality_rubric",
    maxTokens: 1024,
  });

  const scores = [
    rubric.voice_match,
    rubric.specificity,
    rubric.actionability,
    rubric.structure,
    rubric.no_fabrication,
  ];
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const pass = !prohibited.flagged && mean >= 7 && Math.min(...scores) >= 5;

  return { pass, rubric, prohibited };
}
