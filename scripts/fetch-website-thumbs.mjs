#!/usr/bin/env node
// One-shot: download portfolio thumbnails from xwhystudio.com, re-host on
// walkperro under /public/websites/<slug>/thumb.webp. Resizes to 1600x1000
// to match the existing project hero spec. Idempotent — re-run to refresh.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = "https://xwhystudio.com";

// Maps walkperro slug → xwhystudio source asset path (under /portfolio/).
const SOURCES = [
  { slug: "restaurant",         src: "/portfolio/svc-restaurant.png" },
  { slug: "ecommerce",          src: "/portfolio/svc-store.png" },
  { slug: "personal-training",  src: "/portfolio/svc-training.png" },
  { slug: "ai-directory",       src: "/portfolio/aitoolsort.png" },
  { slug: "group-home",         src: "/portfolio/svc-grouphome.png" },
  { slug: "clinic",             src: "/portfolio/clinic.png" },
  { slug: "roofing",            src: "/portfolio/svc-roofing.png" },
  { slug: "hvac",               src: "/portfolio/svc-hvac.png" },
  { slug: "plumbing",           src: "/portfolio/svc-plumbing.png" },
  { slug: "landscaping",        src: "/portfolio/svc-landscaping.png" },
];

async function fetchOne({ slug, src }) {
  const url = `${ROOT}${src}`;
  console.log(`\n→ ${slug}  (${src})`);
  const res = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4) walkperro-thumb-fetch",
    },
  });
  if (!res.ok) {
    console.error(`  ✗ HTTP ${res.status} fetching ${url}`);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  const outDir = path.join("public", "websites", slug);
  mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, "thumb.webp");
  await sharp(buf)
    .resize(1600, 1000, { fit: "cover", position: "center" })
    .webp({ quality: 82, effort: 5 })
    .toFile(outPath);
  const size = (await sharp(outPath).metadata()).size || 0;
  console.log(`  ✓ ${outPath}  (${(size / 1024).toFixed(1)}kb)`);
  return true;
}

async function main() {
  let ok = 0;
  for (const item of SOURCES) {
    const success = await fetchOne(item);
    if (success) ok++;
    await new Promise((r) => setTimeout(r, 250));
  }
  console.log(`\nDone. ${ok}/${SOURCES.length} succeeded.`);
  if (ok < SOURCES.length) process.exit(1);
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
