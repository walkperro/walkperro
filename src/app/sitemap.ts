import type { MetadataRoute } from "next";

const baseUrl = "https://walkperro.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/policy`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
