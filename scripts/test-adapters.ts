// Lightweight adapter check (no network, no DB). Run from repo root:
//   npx tsx scripts/test-adapters.ts
import assert from "node:assert/strict";
import { tiktokAdapter } from "../src/lib/platforms/tiktok";

async function main() {
process.env.MOCK_APIFY = "1";

// URL routing (adapter-level; the registry in index.ts just fans over these)
assert.deepEqual(
  tiktokAdapter.parseProfileUrl("https://www.tiktok.com/@prepwithsam"),
  { handle: "prepwithsam" },
  "tiktok url parses handle"
);
assert.equal(
  tiktokAdapter.parseProfileUrl("https://example.com/nope"),
  null,
  "non-tiktok url returns null"
);
assert.deepEqual(
  tiktokAdapter.parseProfileUrl("https://www.tiktok.com/@prepwithsam/video/7412"),
  { handle: "prepwithsam" },
  "video url still yields the handle"
);

// Scrape (mock) → normalize
const started = await tiktokAdapter.startScrape("prepwithsam", { maxVideos: 50 });
assert.ok("items" in started, "mock returns items inline");
const scrape = tiktokAdapter.normalize(started.items);

assert.equal(scrape.profile.handle, "prepwithsam");
assert.equal(scrape.profile.followerCount, 148000);
assert.ok(scrape.videos.length >= 3, "multiple videos normalized");

const byId = (id: string) => scrape.videos.find((v) => v.platformVideoId === id)!;

const v1 = byId("7412300000000000001");
assert.equal(v1.views, 512000);
assert.deepEqual(v1.hashtags, ["mealprep", "highprotein", "busy"]);
assert.ok(v1.captionTrackUrl, "v1 has a subtitle link");
assert.equal(tiktokAdapter.transcriptStrategy(v1), "caption-track");

// v2 has no subtitle link but has a media url → whisper
const v2 = byId("7412300000000000002");
assert.equal(v2.captionTrackUrl, undefined);
assert.equal(tiktokAdapter.transcriptStrategy(v2), "whisper");

// createTime (unix) normalizes to ISO
assert.ok(v2.postedAt && v2.postedAt.startsWith("20"), "unix createTime → ISO");

// author metadata is only on the first item but applies to the whole profile
assert.equal(byId("7412300000000000008").url.includes("prepwithsam"), true);

console.log(
  `✓ adapter tests passed (${scrape.videos.length} videos, url routing, transcript strategy)`
);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
