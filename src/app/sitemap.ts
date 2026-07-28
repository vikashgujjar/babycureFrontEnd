import type { MetadataRoute } from "next";
import { getSitemapEntries } from "@/lib/api/queries/content";
import { SITE_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries = await getSitemapEntries().catch(() => []);

  return entries.map((entry) => ({
    url: `${SITE_URL}${entry.loc}`,
    lastModified: entry.lastmod ?? undefined,
    changeFrequency: entry.changefreq as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: Number(entry.priority),
  }));
}
