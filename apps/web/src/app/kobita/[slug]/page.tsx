//apps/web/src/app/kobita/[slug]/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Eye, Calendar } from 'lucide-react';

import { fetchPoemBySlug, fetchPoems } from '@/lib/api/endpoints';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { ShareButtons } from '@/components/shared/ShareButtons';
import { IslamicDivider } from '@/components/shared/IslamicDivider';
import { ReadingProgress } from '@/components/content/ReadingProgress';
import { ViewTracker } from '@/components/content/ViewTracker';
import { PoemCard } from '@/components/content/PoemCard';
import { siteConfig } from '@/config/site';
import { formatBengaliDate, toBengaliDigits } from '@kobi/utils';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const poem = await fetchPoemBySlug(slug);
    return {
      title: poem.title,
      description: poem.seoDescription || poem.excerpt || poem.title,
      openGraph: {
        type: 'article',
        title: poem.title,
        description: poem.seoDescription || poem.excerpt || poem.title,
        url: `${siteConfig.url}/kobita/${slug}`,
        images: poem.coverImage ? [{ url: poem.coverImage }] : undefined,
        publishedTime: poem.publishedAt,
        authors: [siteConfig.author],
      },
      twitter: {
        card: 'summary_large_image',
        title: poem.title,
        description: poem.seoDescription || poem.excerpt || '',
        images: poem.coverImage ? [poem.coverImage] : undefined,
      },
    };
  } catch {
    return { title: 'কবিতা' };
  }
}

export default async function PoemPage({ params }: Props) {
  const { slug } = await params;

  let poem;
  try {
    poem = await fetchPoemBySlug(slug);
  } catch {
    notFound();
  }

  // Related — same category, exclude current
  const related = await fetchPoems({
    limit: 4,
    category: (poem as any).category?._id,
  }).catch(() => ({ data: [], meta: null }));

  const relatedPoems = (related.data || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  return (
    <article>
      {/* Reading progress bar */}
      <ReadingProgress />

      {/* Auto view tracker */}
      <ViewTracker type="poems" slug={slug} />

      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: poem.title,
            description: poem.excerpt || poem.title,
            image: poem.coverImage,
            datePublished: poem.publishedAt,
            dateModified: poem.updatedAt,
            author: {
              '@type': 'Person',
              name: siteConfig.author,
            },
            publisher: {
              '@type': 'Organization',
              name: siteConfig.name,
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${siteConfig.url}/kobita/${slug}`,
            },
          }),
        }}
      />

      {/* Header — editorial style */}
      <header className="relative pt-32 md:pt-40 pb-12 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.12]" />

        <div className="relative container-reading">
          <Breadcrumb
            items={[
              { label: 'হোম', href: '/' },
              { label: 'কবিতা সমগ্র', href: '/kobita' },
              ...((poem as any).category
                ? [
                    {
                      label: (poem as any).category.name,
                      href: `/kobita/category/${(poem as any).category.slug}`,
                    },
                  ]
                : []),
              { label: poem.title },
            ]}
            className="mb-10 justify-center"
          />

          <div className="text-center">
            {(poem as any).category && (
              <Link
                href={`/kobita/category/${(poem as any).category.slug}`}
                className="inline-block text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-5 hover:text-[var(--color-gold-500)] transition-colors"
              >
                {(poem as any).category.name}
              </Link>
            )}

            <h1 className="font-bangla text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-ink-900)] leading-[1.25] tracking-tight">
              {poem.title}
            </h1>

            <IslamicDivider className="max-w-xs mx-auto my-7" />

            <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-[var(--color-ink-400)]">
              {poem.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatBengaliDate(poem.publishedAt)}
                </span>
              )}
              {poem.readingTimeMinutes && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {toBengaliDigits(poem.readingTimeMinutes)} মিনিট পাঠ
                </span>
              )}
              {poem.viewCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {toBengaliDigits(poem.viewCount)} বার পঠিত
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Cover image */}
      {poem.coverImage && (
        <div className="container-reading -mt-2 mb-12">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden shadow-[var(--shadow-soft)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poem.coverImage}
              alt={poem.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Reading content */}
      <section className="py-8 md:py-12">
        <div className="container-reading">
          <div
            className="prose-reading"
            dangerouslySetInnerHTML={{ __html: poem.content }}
          />

          {/* Tags */}
          {poem.tags && poem.tags.length > 0 && (
            <div className="mt-14 pt-8 border-t border-[var(--color-border)]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-wider text-[var(--color-ink-400)] mr-2">
                  ট্যাগ:
                </span>
                {poem.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/kobita?tag=${encodeURIComponent(tag)}`}
                    className="px-3 py-1 rounded-full text-xs border border-[var(--color-border)] text-[var(--color-ink-600)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors font-bangla"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
            <ShareButtons
              url={`/kobita/${slug}`}
              title={poem.title}
            />
          </div>
        </div>
      </section>

      {/* Related */}
      {relatedPoems.length > 0 && (
        <section className="py-20 bg-[var(--color-cream-100)]">
          <div className="container-literary">
            <div className="text-center mb-12">
              <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-3">
                আরও পড়ুন
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-[var(--color-green-deep)]">
                সম্পর্কিত কবিতা
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
              {relatedPoems.map((p, idx) => (
                <PoemCard key={p._id} poem={p as any} index={idx} />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  );
}