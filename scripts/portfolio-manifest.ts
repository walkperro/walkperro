// URL list consumed by scripts/portfolio-screenshot.ts.
// Mirrors src/data/portfolio-manifest.ts but only carries what the screenshot pipeline needs.

export interface ShotTarget {
  slug: string;
  url: string;
}

export const shotTargets: ShotTarget[] = [
  { slug: "summer", url: "https://summerloffler.com" },
  { slug: "shirt_shop", url: "https://gaprinthub.vercel.app" },
  { slug: "fozzies", url: "https://fozziesdining.com" },
  { slug: "countime", url: "https://countime.vercel.app" },
  { slug: "process-service", url: "https://process-service.vercel.app" },
  { slug: "group-home", url: "https://athomefamilyservices.com" },
  { slug: "v-techinc", url: "https://v-techinc.vercel.app" },
  { slug: "spy-paper-bot", url: "file:///Users/ironclaw/projects/spy_paper_bot/journal.html" },
];
