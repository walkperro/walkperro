#!/usr/bin/env node
// One-shot: downscale showroom card images to GPU-friendly 1024x640 webp
// textures under public/showroom/tex/<slug>.webp. Keeps VRAM ~2.6MB/plane
// instead of 6.4MB at the full 1600x1000. Re-run whenever showroom.ts
// gains items or source images change. Reads the item list straight from
// src/content/showroom.ts via a light regex (no TS runtime needed).

import { readFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const src = readFileSync("src/content/showroom.ts", "utf8");

// Pull { slug, image } pairs. fromTemplate items resolve image via
// websites.ts, so parse that file too for thumb paths.
const websites = readFileSync("src/content/websites.ts", "utf8");
const thumbBySlug = {};
for (const m of websites.matchAll(/slug:\s*"([^"]+)"[\s\S]*?thumb:\s*"([^"]+)"/g)) {
  thumbBySlug[m[1]] = m[2];
}

const items = [];
// explicit image entries
for (const m of src.matchAll(/slug:\s*"([^"]+)",[\s\S]*?image:\s*"([^"]+)"/g)) {
  items.push({ slug: m[1], image: m[2] });
}
// fromTemplate("slug", ...) entries
for (const m of src.matchAll(/fromTemplate\(\s*"([^"]+)"/g)) {
  const slug = m[1];
  if (!items.some((i) => i.slug === slug) && thumbBySlug[slug]) {
    items.push({ slug, image: thumbBySlug[slug] });
  }
}

const OUT_DIR = path.join("public", "showroom", "tex");
mkdirSync(OUT_DIR, { recursive: true });

let ok = 0;
for (const { slug, image } of items) {
  const srcPath = path.join("public", image);
  const outPath = path.join(OUT_DIR, `${slug}.webp`);
  try {
    await sharp(srcPath)
      .resize(1024, 640, { fit: "cover", position: "top" })
      .webp({ quality: 80, effort: 5 })
      .toFile(outPath);
    ok++;
    console.log(`✓ ${outPath}`);
  } catch (e) {
    console.error(`✗ ${slug}: ${e.message}`);
  }
}
console.log(`\nDone. ${ok}/${items.length} textures.`);
if (ok < items.length) process.exit(1);
