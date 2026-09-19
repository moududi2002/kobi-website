//apps/web/src/app/sitemap.ts
import type { MetadataRoute } from 'next';
import { fetchSitemapData } from '@/lib/api/endpoints';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const entries = await fetchSitemapData();
    return entries.map((e) => ({
      url: `${siteConfig.url}${e.url}`,
      lastModified: new Date(e.lastModified),
      changeFrequency: e.changeFrequency as any,
      priority: e.priority,
    }));
  } catch {
    return [
      {
        url: siteConfig.url,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}