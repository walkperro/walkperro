/**
 * Capture screenshots of the local production server at all 3 target viewports.
 * Used for visual QA only — outputs land in scripts/.cache/qa/ (gitignored).
 */

import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "scripts", ".cache", "qa");
const URL = process.env.QA_URL ?? "http://localhost:3210";

const VIEWPORTS = [
  { label: "mobile-375", width: 375, height: 800 },
  { label: "tablet-768", width: 768, height: 1024 },
  { label: "desktop-1440", width: 1440, height: 900 },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    await page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });
    // Allow scroll-reveal motion to settle by scrolling through page
    await page.evaluate(async () => {
      await new Promise<void>((res) => {
        let total = 0;
        const step = 400;
        const t = setInterval(() => {
          window.scrollBy(0, step);
          total += step;
          if (total >= document.body.scrollHeight) {
            clearInterval(t);
            window.scrollTo(0, 0);
            setTimeout(() => res(), 400);
          }
        }, 80);
      });
    });
    await page.waitForTimeout(800);

    const out = path.join(OUT, `${vp.label}.png`);
    await page.screenshot({ path: out, fullPage: true });
    console.log(`→ ${path.relative(ROOT, out)}`);
    await ctx.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
