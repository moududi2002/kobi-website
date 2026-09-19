// apps/web/src/lib/seo/jsonld.ts
import { siteConfig } from '@/config/site';
import type { Poem, Lyric } from '@kobi/types';

export function poemJsonLd(poem: Poem, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: poem.title,
    description: poem.excerpt || poem.title,
    image: poem.coverImage,
    datePublished: poem.publishedAt,
    dateModified: poem.updatedAt,
    author: { '@type': 'Person', name: siteConfig.author },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}/kobita/${slug}`,
    },
  };
}

export function lyricJsonLd(lyric: Lyric, slug: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: lyric.title,
    name: lyric.title,
    description: lyric.excerpt || lyric.title,
    datePublished: lyric.publishedAt,
    dateModified: lyric.updatedAt,
    author: { '@type': 'Person', name: siteConfig.author },
    publisher: { '@type': 'Organization', name: siteConfig.name },
    ...(lyric.youtubeVideoId
      ? {
          video: {
            '@type': 'VideoObject',
            name: lyric.title,
            embedUrl: `https://www.youtube.com/embed/${lyric.youtubeVideoId}`,
            thumbnailUrl: `https://i.ytimg.com/vi/${lyric.youtubeVideoId}/maxresdefault.jpg`,
          },
        }
      : {}),
  };
}