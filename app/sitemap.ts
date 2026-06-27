import type { MetadataRoute } from "next";
import { getPublishedPosts, getPublicTools } from "@/lib/posts-db";
import { getAllWebsites } from "@/lib/websites";

const SITE = "https://www.walkperro.com";

export const revalidate = 60;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/log`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${SITE}/websites`, lastModified: now, changeFrequency: "weekly",  priority: 0.95 },
  ];

  // Dynamic post routes
  const posts = await getPublishedPosts({ limit: 1000 });
  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE}/log/${p.slug}`,
    lastModified: p.published_at ? new Date(p.published_at) : now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  // Dynamic tool routes (only non-DRAFT)
  const tools = await getPublicTools();
  const toolRoutes: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${SITE}/tools/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // /websites/<slug> — static catalog from src/content/websites.ts
  const websiteRoutes: MetadataRoute.Sitemap = getAllWebsites().map((w) => ({
    url: `${SITE}/websites/${w.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...postRoutes, ...toolRoutes, ...websiteRoutes];
}
