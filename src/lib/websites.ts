// Thin selectors over WEBSITES. Server-safe (no client deps). Sorted by
// `order` so the rendered catalog grid matches the data file.

import { WEBSITES, type WebsiteTemplate } from "@/content/websites";

export function getAllWebsites(): WebsiteTemplate[] {
  return [...WEBSITES].sort((a, b) => a.order - b.order);
}

export function getWebsiteBySlug(slug: string): WebsiteTemplate | undefined {
  return WEBSITES.find((w) => w.slug === slug);
}

export function getWebsiteSlugs(): string[] {
  return WEBSITES.map((w) => w.slug);
}

export type { WebsiteTemplate };
