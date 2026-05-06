import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const TOOL_RESULTS_DIR =
  "/Users/ironclaw/.claude/projects/-Users-ironclaw-projects/eb1c8585-5b16-436a-a8b7-a012b77a08be/tool-results";
const OUT_DIR = "/Users/ironclaw/projects/walkperro/public/portfolio/originals";

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const files = readdirSync(TOOL_RESULTS_DIR).filter((f) =>
  f.startsWith("mcp-0be7a705-e8d5-4e8e-ab74-8c31916ced53-download_file_content-")
);

let count = 0;
for (const f of files) {
  const fp = path.join(TOOL_RESULTS_DIR, f);
  const json = JSON.parse(readFileSync(fp, "utf8"));
  if (!json.content || !json.title) continue;
  const out = path.join(OUT_DIR, json.title);
  writeFileSync(out, Buffer.from(json.content, "base64"));
  count++;
  console.log(`wrote ${json.title} (${json.id})`);
}
console.log(`done: ${count} images`);
