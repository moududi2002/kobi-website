// apps/web/src/components/content/PoemCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Clock, Eye } from 'lucide-react';

import type { Poem } from '@kobi/types';
import { cn } from '@kobi/ui';
import { formatBengaliDate, toBengaliDigits } from '@kobi/utils';

interface Props {
  poem: Poem & { category?: { name: string; slug: string } | null };
  variant?: 'default' | 'compact' | 'large';
  index?: number;
}

export function PoemCard({ poem, variant = 'default', index = 0 }: Props) {
  const href = `/kobita/${poem.slug}`;
  const hasCover = !!poem.coverImage;

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
          className="group block py-6 border-b border-[var(--color-border)] last:border-0"
        >
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-bangla text-lg md:text-xl font-medium text-[var(--color-ink-800)] group-hover:text-[var(--color-green-deep)] transition-colors leading-snug">
              {poem.title}
            </h3>
            <span className="text-xs text-[var(--color-ink-400)] shrink-0 tabular-nums">
              {formatBengaliDate(poem.publishedAt || poem.createdAt)}
            </span>
          </div>
          {poem.excerpt && (
            <p className="mt-1.5 text-sm text-[var(--color-ink-500)] line-clamp-1">
              {poem.excerpt}
            </p>
          )}
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
        {/* Cover image */}
        <div
          className={cn(
            'relative overflow-hidden rounded-lg bg-[var(--color-cream-100)]',
            variant === 'large' ? 'aspect-[4/3]' : 'aspect-[5/4]',
          )}
        >
          {hasCover ? (
            <Image
              src={poem.coverImage!}
              alt={poem.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-[var(--ease-elegant)] group-hover:scale-[1.03]"
            />
          ) : (
            <div className="absolute inset-0 pattern-islamic-soft flex items-center justify-center">
              <span className="font-display text-5xl text-[var(--color-gold-400)] opacity-40">
                ❦
              </span>
            </div>
          )}
          {/* Ornament corner */}
          <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-[var(--color-cream-50)]/40 opacity-60" />
          <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-[var(--color-cream-50)]/40 opacity-60" />
        </div>

        {/* Category + date */}
        <div className="mt-5 flex items-center gap-3 text-xs text-[var(--color-ink-400)]">
          {poem.category && (
            <>
              <span className="uppercase tracking-wider font-medium text-[var(--color-gold-600)]">
                {poem.category.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-[var(--color-ink-300)]" />
            </>
          )}
          <span>{formatBengaliDate(poem.publishedAt || poem.createdAt)}</span>
        </div>

        {/* Title */}
        <h3
          className={cn(
            'mt-3 font-bangla font-semibold text-[var(--color-ink-900)] group-hover:text-[var(--color-green-deep)] transition-colors leading-snug',
            variant === 'large' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl',
          )}
        >
          {poem.title}
        </h3>

        {/* Excerpt */}
        {poem.excerpt && (
          <p className="mt-3 text-sm md:text-base text-[var(--color-ink-500)] line-clamp-3 leading-relaxed">
            {poem.excerpt}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto pt-5 flex items-center gap-4 text-xs text-[var(--color-ink-400)]">
          {poem.readingTimeMinutes && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {toBengaliDigits(poem.readingTimeMinutes)} মিনিট
            </span>
          )}
          {poem.viewCount > 0 && (
            <span className="flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              {toBengaliDigits(poem.viewCount)}
            </span>
          )}
        </div>
      </Link>
    </motion.article>
  );
}