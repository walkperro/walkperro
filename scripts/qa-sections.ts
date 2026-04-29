/**
 * Capture viewport-sized screenshots of each section so we can review design.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "scripts", ".cache", "qa");
const URL = process.env.QA_URL ?? "http://localhost:3210";

const SECTIONS = [
  { label: "01-hero", scrollTo: "#top" },
  { label: "02-offerings", scrollTo: "#services" },
  { label: "03-work-top", scrollTo: "#work" },
  { label: "04-work-grid", scrollY: 2400 },
  { label: "05-about", scrollTo: "#studio" },
  { label: "06-contact", scrollTo: "#contact" },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30_000 });

  for (const s of SECTIONS) {
    if (s.scrollTo) {
      await page.evaluate((sel) => {
        const el = document.querySelector(sel as string);
        if (el) (el as HTMLElement).scrollIntoView({ behavior: "instant", block: "start" });
      }, s.scrollTo);
    } else if (s.scrollY) {
      await page.evaluate((y) => window.scrollTo(0, y as number), s.scrollY);
    }
    await page.waitForTimeout(700);
    const out = path.join(OUT, `${s.label}.png`);
    await page.screenshot({ path: out });
    console.log(`→ ${path.relative(ROOT, out)}`);
  }

  await ctx.close();
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
