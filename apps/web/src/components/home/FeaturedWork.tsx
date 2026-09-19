//apps/web/src/components/home/FeaturedWork.tsx
'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';

import type { Poem } from '@kobi/types';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

interface Props {
  poem: Poem;
}

export function FeaturedWork({ poem }: Props) {
  // Take first 2 paragraphs of contentPlain or full content
  const plainText = (poem as any).contentPlain || stripHtml(poem.content || '');
  const previewText = plainText.split(/\n+/).slice(0, 2).join('\n\n').slice(0, 500);
  const displayText = previewText || poem.excerpt || '';

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[var(--color-green-deep)] text-[var(--color-cream-50)]">
      {/* Islamic pattern overlay */}
      <div
        className="absolute inset-0 pattern-islamic-soft opacity-[0.08]"
        aria-hidden="true"
      />

      {/* Ornamental top/bottom gold lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold-500)]/60 to-transparent" />

      <div className="relative container-literary max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <BookOpen className="w-4 h-4 text-[var(--color-gold-400)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-400)] font-medium">
              নির্বাচিত কবিতা
            </span>
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="font-bangla text-3xl md:text-5xl lg:text-6xl font-semibold text-center leading-[1.2] tracking-tight text-[var(--color-cream-50)]"
        >
          {poem.title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <IslamicDivider className="max-w-xs mx-auto mt-8" />
        </motion.div>

        {displayText && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="mt-12"
          >
            <div className="prose-reading text-[var(--color-cream-200)] text-lg md:text-xl leading-[2] font-bangla whitespace-pre-line text-center">
              {displayText}
              {plainText.length > displayText.length && (
                <span className="opacity-60">…</span>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-14 text-center"
        >
          <Link
            href={`/kobita/${poem.slug}`}
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-[var(--color-gold-500)] text-[var(--color-gold-300)] hover:bg-[var(--color-gold-500)] hover:text-[var(--color-ink-900)] transition-all duration-300 font-medium"
          >
            সম্পূর্ণ কবিতা পড়ুন
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// Helper
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}