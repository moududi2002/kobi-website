//apps/web/src/components/content/LyricCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Play, Music2 } from 'lucide-react';

import type { Lyric } from '@kobi/types';
import { cn } from '@kobi/ui';
import { formatBengaliDate } from '@kobi/utils';
import { getYouTubeThumbnail } from '@kobi/utils';

interface Props {
  lyric: Lyric & { category?: { name: string; slug: string } | null };
  variant?: 'default' | 'compact';
  index?: number;
}

export function LyricCard({ lyric, variant = 'default', index = 0 }: Props) {
  const href = `/lyrics/${lyric.slug}`;
  const hasYoutube = !!lyric.youtubeVideoId;

  if (variant === 'compact') {
    return (
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
          delay: index * 0.05,
        }}
      >
        <Link
          href={href}
          className="group flex items-center gap-4 py-4 border-b border-[var(--color-border)] last:border-0"
        >
          {hasYoutube && (
            <div className="relative w-20 h-14 shrink-0 rounded overflow-hidden bg-[var(--color-cream-200)]">
              <Image
                src={getYouTubeThumbnail(lyric.youtubeVideoId!, 'hq')}
                alt={lyric.title}
                fill
                sizes="80px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-bangla text-base font-medium text-[var(--color-ink-800)] group-hover:text-[var(--color-green-deep)] transition-colors truncate">
              {lyric.title}
            </h3>
            {lyric.category && (
              <p className="text-xs text-[var(--color-gold-600)] mt-0.5">
                {lyric.category.name}
              </p>
            )}
          </div>
        </Link>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        delay: index * 0.08,
      }}
      className="group h-full"
    >
      <Link href={href} className="flex flex-col h-full">
        {/* Cover / YouTube thumbnail */}
        <div className="relative overflow-hidden rounded-lg bg-[var(--color-green-deep)] aspect-video">
          {hasYoutube ? (
            <>
              <Image
                src={getYouTubeThumbnail(lyric.youtubeVideoId!, 'hq')}
                alt={lyric.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="w-16 h-16 rounded-full bg-[var(--color-cream-50)]/95 flex items-center justify-center shadow-[var(--shadow-elevated)]">
                  <Play className="w-7 h-7 text-[var(--color-green-deep)] fill-[var(--color-green-deep)] ml-1" />
                </div>
              </div>
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-[var(--color-cream-50)]/90 backdrop-blur-sm text-[10px] font-medium uppercase tracking-wider text-[var(--color-green-deep)]">
                ▶ ভিডিও
              </div>
            </>
          ) : (
            <div className="absolute inset-0 pattern-islamic-soft flex items-center justify-center">
              <Music2 className="w-16 h-16 text-[var(--color-gold-400)] opacity-40" />
            </div>
          )}
        </div>

        {/* Category + date */}
        <div className="mt-5 flex items-center gap-3 text-xs text-[var(--color-ink-400)]">
          {lyric.category && (
            <>
              <span className="uppercase tracking-wider font-medium text-[var(--color-gold-600)]">
                {lyric.category.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-ink-300)]" />
            </>
          )}
          <span>{formatBengaliDate(lyric.publishedAt || lyric.createdAt)}</span>
        </div>

        {/* Title */}
        <h3 className="mt-3 font-bangla text-xl md:text-2xl font-semibold text-[var(--color-ink-900)] group-hover:text-[var(--color-green-deep)] transition-colors leading-snug">
          {lyric.title}
        </h3>

        {/* Excerpt */}
        {lyric.excerpt && (
          <p className="mt-3 text-sm md:text-base text-[var(--color-ink-500)] line-clamp-3 leading-relaxed">
            {lyric.excerpt}
          </p>
        )}
      </Link>
    </motion.article>
  );
}