import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const ROOT = process.cwd();
const OUT = path.join(ROOT, "scripts", ".cache", "qa");

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto("http://localhost:3210/#backends", { waitUntil: "networkidle", timeout: 30_000 });
  await page.waitForTimeout(700);
  await page.screenshot({ path: path.join(OUT, "07-backends-top.png") });
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "08-backends-mid.png") });
  await page.evaluate(() => window.scrollBy(0, 900));
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT, "09-backends-end.png") });
  await ctx.close();
  await browser.close();
  console.log("ok");
}
main();
