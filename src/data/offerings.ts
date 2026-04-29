export interface Offering {
  number: string;
  title: string;
  body: string;
  tags: string[];
}

export const offerings: Offering[] = [
  {
    number: "01",
    title: "Custom websites & web apps",
    body: "Marketing sites, admin dashboards, full applications. Designed in-house, engineered on a modern stack, shipped in days — not months. Vibe-coded with Claude, hand-finished by a human.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Vercel"],
  },
  {
    number: "02",
    title: "AI automation & custom tools",
    body: "Trading bots, internal tools, productized workflows. We hook your business up to the same engines that built the model reading this — quietly, in the background, while you sleep.",
    tags: ["Python", "Node", "OpenAI", "Anthropic", "Cron"],
  },
  {
    number: "03",
    title: "Brand-grade UI / UX",
    body: "The design layer most dev shops cannot deliver. Editorial typography, restrained palettes, motion that does not beg for attention. Sites that feel made — not configured.",
    tags: ["Figma", "Design systems", "Motion", "Identity"],
  },
];
