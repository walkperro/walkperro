/**
 * Brand image generation via Google Gemini ("Nano Banana 2").
 *
 * Reads GOOGLE_API_KEY from .env.local (loaded by --env-file).
 * NEVER logs or echoes the API key value.
 *
 * Usage:
 *   pnpm brand:generate            # generate any missing assets
 *   pnpm brand:generate --force    # regenerate everything
 *   pnpm brand:generate --only=og  # only the slug listed
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { GoogleGenAI } from "@google/genai";
import { brandImages, type BrandImageSpec } from "./brand-image-manifest.ts";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, "scripts", ".cache", "brand");
const OUT_DIR = path.join(ROOT, "public", "brand");
const PUBLIC_ROOT = path.join(ROOT, "public");

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const onlyTarget = onlyArg ? onlyArg.split("=")[1] : null;

function maskKey(value: string | undefined): string {
  if (!value) return "(not set)";
  if (value.length <= 6) return "(redacted)";
  return `${value.slice(0, 4)}…(${value.length} chars)`;
}

async function ensureDir(dir: string) {
  await fs.mkdir(dir, { recursive: true });
}

async function fileExists(file: string): Promise<boolean> {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function generateOne(
  ai: GoogleGenAI,
  spec: BrandImageSpec,
): Promise<Buffer | null> {
  const model = spec.model ?? "gemini-3-pro-image-preview";

  // The @google/genai v1 SDK passes generation options under `config`.
  // imageConfig.aspectRatio drives output framing without polluting the prompt.
  const response = await ai.models.generateContent({
    model,
    contents: spec.prompt,
    config: {
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: spec.aspectRatio,
      },
    },
  });

  const candidate = response.candidates?.[0];
  const parts = candidate?.content?.parts ?? [];

  for (const part of parts) {
    const inline = (part as { inlineData?: { data?: string } }).inlineData;
    if (inline?.data) {
      return Buffer.from(inline.data, "base64");
    }
  }
  return null;
}

async function postProcess(
  spec: BrandImageSpec,
  pngPath: string,
): Promise<string[]> {
  const widths = spec.postProcess?.widths ?? [1600];
  const quality = spec.postProcess?.quality ?? 80;
  const written: string[] = [];

  for (const width of widths) {
    const ext = spec.slug === "logomark" && width <= 512 ? "png" : "webp";
    const outPath = path.join(OUT_DIR, `${spec.slug}-${width}.${ext}`);

    const pipeline = sharp(pngPath).resize({ width, withoutEnlargement: true });
    if (ext === "webp") {
      await pipeline.webp({ quality }).toFile(outPath);
    } else {
      await pipeline.png({ compressionLevel: 9 }).toFile(outPath);
    }
    written.push(path.relative(ROOT, outPath));
  }

  // Special exports
  if (spec.slug === "og") {
    // Generate exact 1200x630 OG image as PNG (Slack/iMessage prefer PNG/JPG)
    const ogPath = path.join(PUBLIC_ROOT, "og.png");
    await sharp(pngPath)
      .resize({ width: 1200, height: 630, fit: "cover", position: "center" })
      .png({ compressionLevel: 9 })
      .toFile(ogPath);
    written.push(path.relative(ROOT, ogPath));
  }

  if (spec.slug === "logomark") {
    // Favicon set
    for (const size of [32, 192, 512]) {
      const out = path.join(
        PUBLIC_ROOT,
        size === 32 ? "favicon.ico" : `icon-${size}.png`,
      );
      if (size === 32) {
        // 32x32 PNG written to favicon.ico (modern browsers accept PNG bytes in .ico)
        await sharp(pngPath).resize(32, 32).png().toFile(out);
      } else {
        await sharp(pngPath).resize(size, size).png().toFile(out);
      }
      written.push(path.relative(ROOT, out));
    }
    // Apple touch icon (180x180)
    const apple = path.join(PUBLIC_ROOT, "apple-touch-icon.png");
    await sharp(pngPath).resize(180, 180).png().toFile(apple);
    written.push(path.relative(ROOT, apple));
  }

  return written;
}

async function main() {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    console.error(
      "GOOGLE_API_KEY is not set. Add it to .env.local and re-run.",
    );
    process.exit(1);
  }
  console.log(`[brand:generate] using GOOGLE_API_KEY ${maskKey(apiKey)}`);

  await ensureDir(CACHE_DIR);
  await ensureDir(OUT_DIR);

  const ai = new GoogleGenAI({ apiKey });

  const targets = onlyTarget
    ? brandImages.filter((b) => b.slug === onlyTarget)
    : brandImages;

  if (onlyTarget && targets.length === 0) {
    console.error(`No brand image with slug "${onlyTarget}" in manifest.`);
    process.exit(1);
  }

  let generated = 0;
  let skipped = 0;
  let failed = 0;

  for (const spec of targets) {
    const pngPath = path.join(CACHE_DIR, `${spec.slug}.png`);
    const sentinelOut = path.join(
      OUT_DIR,
      `${spec.slug}-${spec.postProcess?.widths?.[0] ?? 1600}.webp`,
    );

    if (!force && (await fileExists(sentinelOut))) {
      console.log(`[skip] ${spec.slug} (already exists)`);
      skipped += 1;
      continue;
    }

    console.log(`[gen ] ${spec.slug} (${spec.aspectRatio}, ${spec.model ?? "pro"})`);
    try {
      const buf = await generateOne(ai, spec);
      if (!buf) {
        console.error(`[fail] ${spec.slug}: no image returned`);
        failed += 1;
        continue;
      }
      await fs.writeFile(pngPath, buf);
      const written = await postProcess(spec, pngPath);
      written.forEach((p) => console.log(`       → ${p}`));
      generated += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(`[fail] ${spec.slug}: ${msg}`);
      failed += 1;
    }
  }

  console.log(
    `\n[brand:generate] done — ${generated} generated, ${skipped} skipped, ${failed} failed.`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[brand:generate] fatal", err);
  process.exit(1);
});
