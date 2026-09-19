//apps/web/src/app/preview/[token]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Eye, AlertTriangle } from 'lucide-react';

import { apiClient } from '@/lib/api/client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'প্রিভিউ (অপ্রকাশিত)',
  robots: { index: false, follow: false, nocache: true },
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PreviewPage({ params }: Props) {
  const { token } = await params;

  let data: any = null;
  try {
    data = await apiClient.get<any>(
      `/preview/${encodeURIComponent(token)}`,
      { cache: 'no-store' },
    );
  } catch {
    notFound();
  }

  const content = data?.content;
  const type = data?.type;

  if (!content) notFound();

  const isPoem = type === 'poem';
  const isLyric = type === 'lyric';

  return (
    <article className="pt-32 md:pt-40">
      {/* Preview banner */}
      <div className="sticky top-16 md:top-20 z-40 bg-[var(--color-gold-400)]/95 backdrop-blur-sm border-y border-[var(--color-gold-600)]">
        <div className="container-literary py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[var(--color-ink-900)]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-xs md:text-sm font-medium font-bangla">
              এটি একটি ড্রাফট প্রিভিউ — এখনো প্রকাশিত হয়নি
            </p>
          </div>
          <div className="flex items-center gap-2 text-[var(--color-ink-900)]">
            <Eye className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {content.status === 'draft' && 'ড্রাফট'}
              {content.status === 'archived' && 'আর্কাইভড'}
              {content.status === 'published' && 'প্রকাশিত'}
            </span>
          </div>
        </div>
      </div>

      <header className="relative py-12 md:py-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.12]" />
        <div className="relative container-reading text-center">
          {content.category && (
            <p className="inline-block text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-5">
              {content.category.name}
            </p>
          )}

          <h1 className="font-bangla text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-ink-900)] leading-[1.25] mb-7">
            {content.title}
          </h1>

          <div className="flex items-center justify-center gap-3 my-4">
            <span className="h-px w-12 bg-[var(--color-gold-500)]" />
            <span className="text-[var(--color-gold-500)] text-xs">◆</span>
            <span className="h-px w-12 bg-[var(--color-gold-500)]" />
          </div>
        </div>
      </header>

      {/* YouTube preview for lyric */}
      {isLyric && content.youtubeVideoId && (
        <section className="pt-10 pb-6">
          <div className="container-reading max-w-3xl">
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black shadow-[var(--shadow-elevated)]">
              <iframe
                src={`https://www.youtube.com/embed/${content.youtubeVideoId}`}
                title={content.title}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </div>
        </section>
      )}

      <section className="py-8 md:py-12">
        <div className="container-reading">
          <div
            className="prose-reading"
            dangerouslySetInnerHTML={{ __html: content.content }}
          />
        </div>
      </section>

      <div className="container-reading py-12 text-center">
        <Link
          href="/"
          className="text-sm text-[var(--color-ink-500)] hover:text-[var(--color-green-deep)]"
        >
          ← হোমে ফিরে যান
        </Link>
      </div>
    </article>
  );
}