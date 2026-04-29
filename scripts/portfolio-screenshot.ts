/**
 * Portfolio screenshots via Playwright + Sharp.
 *
 * Captures each portfolio target at desktop (1440x900) and mobile (390x844)
 * viewports, optimizes to webp, and writes a 24px-wide LQIP base64 alongside.
 *
 * Usage:
 *   pnpm portfolio:capture            # capture any missing screenshots
 *   pnpm portfolio:capture --force    # recapture everything
 *   pnpm portfolio:capture --only=summer
 */

import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { chromium, devices } from "playwright";
import { shotTargets } from "./portfolio-manifest.ts";

const ROOT = process.cwd();
const CACHE_DIR = path.join(ROOT, "scripts", ".cache", "portfolio");
const OUT_DIR = path.join(ROOT, "public", "portfolio");
const LQIP_PATH = path.join(ROOT, "src", "data", "portfolio-lqip.json");

const args = new Set(process.argv.slice(2));
const force = args.has("--force");
const onlyArg = process.argv.find((a) => a.startsWith("--only="));
const onlyTarget = onlyArg ? onlyArg.split("=")[1] : null;

const VIEWPORTS = [
  {
    label: "desktop",
    width: 1440,
    height: 900,
    targetWidth: 1600,
  },
  {
    label: "mobile",
    width: 390,
    height: 844,
    targetWidth: 800,
    device: devices["iPhone 15"],
  },
] as const;

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

interface LqipMap {
  [slug: string]: { desktop: string; mobile: string };
}

async function readLqipMap(): Promise<LqipMap> {
  try {
    const buf = await fs.readFile(LQIP_PATH, "utf8");
    return JSON.parse(buf);
  } catch {
    return {};
  }
}

async function writeLqipMap(map: LqipMap) {
  await fs.writeFile(LQIP_PATH, JSON.stringify(map, null, 2));
}

async function captureOne(
  browser: import("playwright").Browser,
  target: { slug: string; url: string },
  viewport: (typeof VIEWPORTS)[number],
): Promise<{ webpPath: string; lqip: string } | null> {
  const cachePng = path.join(CACHE_DIR, `${target.slug}-${viewport.label}.png`);
  const outWebp = path.join(OUT_DIR, `${target.slug}-${viewport.label}.webp`);

  const ctx = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    ...(viewport.label === "mobile" ? viewport.device : {}),
    colorScheme: "no-preference",
  });

  const page = await ctx.newPage();
  const isFile = target.url.startsWith("file://");
  try {
    await page.goto(target.url, {
      waitUntil: isFile ? "load" : "networkidle",
      timeout: 45_000,
    });
    // Local files with CDN-loaded scripts (Chart.js, etc.) need a moment to render
    if (isFile) await page.waitForTimeout(2500);
  } catch (err) {
    console.error(
      `[fail] ${target.slug}/${viewport.label}: page.goto — ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    await ctx.close();
    return null;
  }

  // Hide common cookie banners / chat widgets that show up on production sites
  await page
    .addStyleTag({
      content: `
        [class*="cookie" i], [id*="cookie" i],
        [class*="consent" i], [id*="consent" i],
        [class*="intercom" i], [id*="intercom" i],
        [class*="crisp" i], [id*="crisp" i],
        iframe[src*="hs-banner"],
        iframe[src*="cookielaw"]
        { display: none !important; }
      `,
    })
    .catch(() => undefined);

  await page.waitForTimeout(800); // settle fade-ins

  let png: Buffer;
  try {
    png = await page.screenshot({ type: "png", fullPage: false });
  } catch (err) {
    console.error(
      `[fail] ${target.slug}/${viewport.label}: screenshot — ${
        err instanceof Error ? err.message : String(err)
      }`,
    );
    await ctx.close();
    return null;
  }

  await fs.writeFile(cachePng, png);

  // Sharp pipeline: resize to retina target width + webp q75
  await sharp(png)
    .resize({ width: viewport.targetWidth, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(outWebp);

  // 24px LQIP base64
  const lqipBuf = await sharp(png)
    .resize({ width: 24 })
    .webp({ quality: 50 })
    .toBuffer();
  const lqip = `data:image/webp;base64,${lqipBuf.toString("base64")}`;

  await ctx.close();
  return { webpPath: outWebp, lqip };
}

async function main() {
  await ensureDir(CACHE_DIR);
  await ensureDir(OUT_DIR);

  const targets = onlyTarget
    ? shotTargets.filter((t) => t.slug === onlyTarget)
    : shotTargets;

  if (onlyTarget && targets.length === 0) {
    console.error(`No portfolio target with slug "${onlyTarget}".`);
    process.exit(1);
  }

  const lqipMap = await readLqipMap();
  const browser = await chromium.launch();

  let captured = 0;
  let skipped = 0;
  let failed = 0;

  for (const target of targets) {
    const targetLqip: { desktop?: string; mobile?: string } = {
      ...(lqipMap[target.slug] ?? {}),
    };
    let anyCaptured = false;

    for (const viewport of VIEWPORTS) {
      const out = path.join(
        OUT_DIR,
        `${target.slug}-${viewport.label}.webp`,
      );
      if (
        !force &&
        (await fileExists(out)) &&
        targetLqip[viewport.label]
      ) {
        console.log(`[skip] ${target.slug}/${viewport.label}`);
        skipped += 1;
        continue;
      }

      console.log(`[shot] ${target.slug}/${viewport.label} ← ${target.url}`);
      const result = await captureOne(browser, target, viewport);
      if (!result) {
        failed += 1;
        continue;
      }
      targetLqip[viewport.label] = result.lqip;
      console.log(`       → ${path.relative(ROOT, result.webpPath)}`);
      captured += 1;
      anyCaptured = true;
    }

    if (anyCaptured) {
      lqipMap[target.slug] = {
        desktop: targetLqip.desktop ?? "",
        mobile: targetLqip.mobile ?? "",
      };
    }
  }

  await writeLqipMap(lqipMap);
  await browser.close();

  console.log(
    `\n[portfolio:capture] done — ${captured} captured, ${skipped} skipped, ${failed} failed.`,
  );
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error("[portfolio:capture] fatal", err);
  process.exit(1);
});
