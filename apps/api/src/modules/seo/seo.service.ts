//apps/api/src/modules/seo/seo.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Poem, PoemDocument, Lyric, LyricDocument } from '../../schemas';

export interface SitemapEntry {
  url: string;      // relative path, e.g. '/kobita/slug'
  lastModified: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly';
  priority: number;
}

@Injectable()
export class SeoService {
  constructor(
    @InjectModel(Poem.name)
    private readonly poemModel: Model<PoemDocument>,
    @InjectModel(Lyric.name)
    private readonly lyricModel: Model<LyricDocument>,
  ) {}

  async getSitemapEntries(): Promise<SitemapEntry[]> {
    const [poems, lyrics] = await Promise.all([
      this.poemModel
        .find({ status: 'published' })
        .select('slug updatedAt publishedAt')
        .lean(),
      this.lyricModel
        .find({ status: 'published' })
        .select('slug updatedAt publishedAt')
        .lean(),
    ]);

    const entries: SitemapEntry[] = [
      {
        url: '/',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: '/kobita',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: '/lyrics',
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: '/porichiti',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: '/jogajog',
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];

    for (const p of poems) {
      entries.push({
        url: `/kobita/${encodeURIComponent(p.slug)}`,
        lastModified: (p.updatedAt || p.publishedAt || new Date()).toString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    for (const l of lyrics) {
      entries.push({
        url: `/lyrics/${encodeURIComponent(l.slug)}`,
        lastModified: (l.updatedAt || l.publishedAt || new Date()).toString(),
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    }

    return entries;
  }
  // RSS Feed Endpoint

  async getRssItems(limit = 20) {
  const [poems, lyrics] = await Promise.all([
    this.poemModel
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('title slug excerpt contentPlain publishedAt')
      .lean(),
    this.lyricModel
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .select('title slug excerpt contentPlain publishedAt')
      .lean(),
  ]);

  const items = [
    ...poems.map((p) => ({
      title: p.title,
      link: `/kobita/${encodeURIComponent(p.slug)}`,
      description: p.excerpt || (p.contentPlain?.slice(0, 300) ?? ''),
      pubDate: (p.publishedAt || new Date()).toISOString(),
      type: 'poem' as const,
    })),
    ...lyrics.map((l) => ({
      title: l.title,
      link: `/lyrics/${encodeURIComponent(l.slug)}`,
      description: l.excerpt || (l.contentPlain?.slice(0, 300) ?? ''),
      pubDate: (l.publishedAt || new Date()).toISOString(),
      type: 'lyric' as const,
    })),
  ]
    .sort(
      (a, b) =>
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime(),
    )
    .slice(0, limit);

  return items;
}
}