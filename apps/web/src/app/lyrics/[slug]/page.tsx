// apps/web/src/app/lyrics/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Eye } from 'lucide-react';

import { fetchLyricBySlug, fetchLyrics } from '@/lib/api/endpoints';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ShareButtons } from '@/components/shared/ShareButtons';
import { IslamicDivider } from '@/components/shared/IslamicDivider';
import { YouTubeEmbed } from '@/components/shared/YouTubeEmbed';
import { ReadingProgress } from '@/components/content/ReadingProgress';
import { ViewTracker } from '@/components/content/ViewTracker';
import { LyricCard } from '@/components/content/LyricCard';
import { siteConfig } from '@/config/site';
import { formatBengaliDate, toBengaliDigits } from '@kobi/utils';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const lyric = await fetchLyricBySlug(slug);
    const ogImages: string[] = [];
    if (lyric.youtubeVideoId) {
      ogImages.push(
        `https://i.ytimg.com/vi/${lyric.youtubeVideoId}/maxresdefault.jpg`,
      );
    }
    return {
      title: lyric.title,
      description: lyric.seoDescription || lyric.excerpt || lyric.title,
      openGraph: {
        type: 'article',
        title: lyric.title,
        description: lyric.seoDescription || lyric.excerpt || lyric.title,
        url: `${siteConfig.url}/lyrics/${slug}`,
        images: ogImages.length ? ogImages : undefined,
        publishedTime: lyric.publishedAt,
        authors: [siteConfig.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: lyric.title,
        description: lyric.seoDescription || lyric.excerpt || '',
        images: ogImages.length ? ogImages : undefined,
      },
    };
  } catch {
    return { title: 'লিরিক' };
  }
}

export default async function LyricPage({ params }: Props) {
  const { slug } = await params;

  let lyric;
  try {
    lyric = await fetchLyricBySlug(slug);
  } catch {
    notFound();
  }

  const related = await fetchLyrics({
    limit: 4,
    category: (lyric as any).category?._id,
  }).catch(() => ({ data: [], meta: null }));

  const relatedLyrics = (related.data || [])
    .filter((l) => l.slug !== slug)
    .slice(0, 3);

  return (
    <article>
      <ReadingProgress />
      <ViewTracker type="lyrics" slug={slug} />

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
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
          }),
        }}
      />

      {/* Header */}
      <header className="relative pt-32 md:pt-40 pb-12 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.12]" />

        <div className="relative container-reading">
          <Breadcrumb
            items={[
              { label: 'হোম', href: '/' },
              { label: 'লিরিক্স', href: '/lyrics' },
              ...((lyric as any).category
                ? [
                    {
                      label: (lyric as any).category.name,
                      href: `/lyrics/category/${(lyric as any).category.slug}`,
                    },
                  ]
                : []),
              { label: lyric.title },
            ]}
            className="mb-10 justify-center"
          />

          <div className="text-center">
            {(lyric as any).category && (
              <Link
                href={`/lyrics/category/${(lyric as any).category.slug}`}
                className="inline-block text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-5 hover:text-[var(--color-gold-500)] transition-colors"
              >
                {(lyric as any).category.name}
              </Link>
            )}

            <h1 className="font-bangla text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-ink-900)] leading-[1.25] tracking-tight">
              {lyric.title}
            </h1>

            <IslamicDivider className="max-w-xs mx-auto my-7" />

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[var(--color-ink-400)]">
              {lyric.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatBengaliDate(lyric.publishedAt)}
                </span>
              )}
              {lyric.viewCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {toBengaliDigits(lyric.viewCount)} বার পঠিত
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* YouTube preview — at top of lyric content */}
      {lyric.youtubeVideoId && (
        <section className="pt-10 pb-6">
          <div className="container-reading max-w-3xl">
            <YouTubeEmbed
              videoId={lyric.youtubeVideoId}
              title={lyric.title}
            />
            <p className="mt-3 text-center text-xs text-[var(--color-ink-400)] italic font-bangla">
              ভিডিওটি YouTube-এ দেখতে প্লে করুন
            </p>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-8 md:py-12">
        <div className="container-reading">
          <div
            className="prose-reading"
            dangerouslySetInnerHTML={{ __html: lyric.content }}
          />

          {lyric.tags && lyric.tags.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[var(--color-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[var(--color-ink-400)] mr-2">
                  ট্যাগ:
                </span>
                {lyric.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/lyrics?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-xs border border-[var(--color-border)] text-[var(--color-ink-600)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors font-bangla"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
            <ShareButtons url={`/lyrics/${slug}`} title={lyric.title} />
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedLyrics.length > 0 && (
        <section className="py-20 bg-[var(--color-cream-100)]">
          <div className="container-literary">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-3">
                আরও শুনুন
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-green-deep)]">
                সম্পর্কিত লিরিক
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {relatedLyrics.map((l, idx) => (
                <LyricCard key={l._id} lyric={l as any} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}