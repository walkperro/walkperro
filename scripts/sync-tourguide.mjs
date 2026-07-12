#!/usr/bin/env node
// Copies src/showroom/tourguide/tourguide.ts into each demo-enabled repo with
// a version header. walkperro's copy is the source of truth — consumer copies
// are generated artifacts. Re-run after editing tourguide.ts.
//
// Usage: node scripts/sync-tourguide.mjs [repo ...]
//   with no args, syncs every repo in TARGETS below.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const SRC = "src/showroom/tourguide/tourguide.ts";
const PROJECTS_ROOT = "/Users/ironclaw/projects";

// repo → destination path (relative to that repo's root)
const TARGETS = {
  fozzies: "src/lib/tourguide.ts",
  shirt_shop: "lib/tourguide.ts",
  closehound: "src/lib/tourguide.ts",
  "group-home": "lib/tourguide.ts",
  LHRC: "lib/tourguide.ts",
  summer: "src/lib/tourguide.ts",
  cuban_study: "src/lib/tourguide.ts",
  bayoubids: "lib/tourguide.ts",
  tradesite: "lib/tourguide.ts",
  bondandfifth: "lib/tourguide.ts",
};

const src = readFileSync(SRC, "utf8");
const versionMatch = src.match(/tourguide — v([\d.]+)/);
const version = versionMatch ? versionMatch[1] : "0.0.0";
const header = `// GENERATED FILE — synced from walkperro/src/showroom/tourguide/tourguide.ts (v${version})
// Do not edit here. Edit in walkperro and re-run: node scripts/sync-tourguide.mjs
`;

const only = process.argv.slice(2);
let ok = 0;
for (const [repo, dest] of Object.entries(TARGETS)) {
  if (only.length && !only.includes(repo)) continue;
  const repoDir = path.join(PROJECTS_ROOT, repo);
  if (!existsSync(repoDir)) {
    console.log(`- ${repo}: repo not found, skipped`);
    continue;
  }
  const destPath = path.join(repoDir, dest);
  mkdirSync(path.dirname(destPath), { recursive: true });
  writeFileSync(destPath, header + src);
  console.log(`✓ ${repo}/${dest} (v${version})`);
  ok++;
}
console.log(`\nSynced ${ok} repos.`);
