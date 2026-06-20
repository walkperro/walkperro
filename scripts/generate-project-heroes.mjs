#!/usr/bin/env node
// One-shot: generate cinematic hero shots for the 4 flagship project cards
// via Google Imagen 4, resize/compress with sharp, write to
// /public/projects/<slug>/hero.webp.
//
// Why this lives here: brand-locked imagery is part of the homepage v2 plan
// (slice 2). Re-run after editing prompts. Idempotent — overwrites the
// hero.webp for each project listed in PROJECTS below.
//
// Env: GOOGLE_API_KEY (in .env.local).

import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

// Load .env.local manually so we don't depend on the next runtime.
const envPath = path.join(process.cwd(), ".env.local");
try {
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2];
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
} catch {}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error("missing GOOGLE_API_KEY in .env.local");
  process.exit(1);
}

const MODEL = process.env.IMAGEN_MODEL || "imagen-4.0-generate-001";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:predict?key=${GOOGLE_API_KEY}`;

// Brand palette (bone #F5F1E8, charcoal #0E0E0E, signal yellow #EBFF00) — must
// be the dominant scheme. No faces, no recognizable people, no AI-tell visual
// clichés (futuristic neon grids, blue HUD overlays, hands-on-keyboard).
const COMMON_STYLE = [
  "cinematic editorial photograph, shot on 35mm film, shallow depth of field, warm golden hour light",
  "premium magazine aesthetic, calm composition, no people, no faces",
  "muted color palette: bone cream, soft charcoal, single small accent of signal yellow",
  "no text overlays, no logos, no UI mockups, no neon, no futuristic glow",
].join(", ");

const PROJECTS = [
  {
    slug: "closehound",
    prompt: [
      "A modern american suburban single-story house at golden hour with a clean for-sale sign in the front yard. Quiet residential street, no cars in frame.",
      "The sign is the only signal-yellow element in the shot. Tasteful, premium real estate magazine cover energy. Soft warm light, bone cream sky.",
      COMMON_STYLE,
    ].join(" "),
  },
  {
    slug: "asere",
    prompt: [
      "Sun-drenched miami art deco building exterior with palm tree shadows on a pastel cream wall. Vintage cuban cafe awning in the corner.",
      "Late afternoon golden light, no people. Small handwritten chalkboard sign in spanish on the wall — the chalkboard frame is the single signal-yellow accent.",
      COMMON_STYLE,
    ].join(" "),
  },
  {
    slug: "1k2rich",
    prompt: [
      "Minimalist trading workstation on a clean light wood desk at dusk. Two monitors faintly glowing with abstract candlestick charts, no readable numbers.",
      "Coffee mug in foreground, leather notebook with a closed pen. Small signal-yellow post-it note stuck to the bezel of one monitor — the only yellow in the frame.",
      "Background out of focus, calm intentional energy, no chaos.",
      COMMON_STYLE,
    ].join(" "),
  },
  {
    slug: "re-study",
    prompt: [
      "Open hardback real estate exam study guide on a clean wood desk, with a vintage parchment-style map of georgia and florida partly visible beside it.",
      "Warm window light from the left, shallow depth of field, a signal-yellow highlighter resting on the open page as the single accent color.",
      "A small ceramic cup of coffee in the corner. Premium textbook editorial aesthetic.",
      COMMON_STYLE,
    ].join(" "),
  },
];

async function generateOne(p) {
  console.log(`\n→ ${p.slug}`);
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      instances: [{ prompt: p.prompt }],
      parameters: { sampleCount: 1, aspectRatio: "16:9" },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`  ✗ ${p.slug} HTTP ${res.status}`);
    console.error("    " + body.slice(0, 400));
    return false;
  }
  const data = await res.json();
  const b64 = data?.predictions?.[0]?.bytesBase64Encoded;
  if (!b64) {
    console.error(`  ✗ ${p.slug} no image in response`);
    console.error("    " + JSON.stringify(data).slice(0, 400));
    return false;
  }
  const png = Buffer.from(b64, "base64");
  const outDir = path.join("public", "projects", p.slug);
  mkdirSync(outDir, { recursive: true });
  const webpPath = path.join(outDir, "hero.webp");
  await sharp(png)
    .resize(1600, 1000, { fit: "cover", position: "center" })
    .webp({ quality: 82, effort: 5 })
    .toFile(webpPath);
  const stat = readFileSync(webpPath);
  console.log(`  ✓ ${webpPath}  (${(stat.length / 1024).toFixed(1)}kb)`);
  return true;
}

async function main() {
  console.log(`Imagen model: ${MODEL}`);
  console.log(`Projects: ${PROJECTS.map((p) => p.slug).join(", ")}`);
  let ok = 0;
  for (const p of PROJECTS) {
    const success = await generateOne(p);
    if (success) ok++;
    // Tiny delay between calls — be a good API citizen.
    await new Promise((r) => setTimeout(r, 500));
  }
  console.log(`\nDone. ${ok}/${PROJECTS.length} succeeded.`);
  if (ok < PROJECTS.length) process.exit(1);
}

main().catch((e) => {
  console.error("Failed:", e);
  process.exit(1);
});
