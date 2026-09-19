//apps/web/src/components/home/LatestWorks.tsx
'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

import type { Poem, Lyric } from '@kobi/types';
import { PoemCard } from '@/components/content/PoemCard';
import { LyricCard } from '@/components/content/LyricCard';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

interface Props {
  poems: Poem[];
  lyrics: Lyric[];
}

export function LatestWorks({ poems, lyrics }: Props) {
  const featuredPoem = poems[0];
  const otherPoems = poems.slice(1, 4);
  const featuredLyric = lyrics[0];
  const otherLyrics = lyrics.slice(1, 4);

  return (
    <section className="relative py-24 md:py-32 bg-[var(--color-cream-100)]">
      <div className="container-literary">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
            সাম্প্রতিক সৃষ্টি
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-green-deep)] leading-tight">
            সর্বশেষ প্রকাশিত
          </h2>
          <IslamicDivider className="max-w-xs mx-auto mt-4" />
        </motion.div>

        {/* POEMS section */}
        {poems.length > 0 && (
          <div className="mb-20">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-500)] font-medium mb-1">
                  কাব্য
                </p>
                <h3 className="font-bangla text-2xl font-semibold text-[var(--color-ink-800)]">
                  সাম্প্রতিক কবিতা
                </h3>
              </div>
              <Link
                href="/kobita"
                className="group hidden md:inline-flex items-center gap-2 text-sm text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] transition-colors"
              >
                সব কবিতা
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {featuredPoem && (
                <div className="md:col-span-2 lg:col-span-1">
                  <PoemCard poem={featuredPoem as any} variant="large" index={0} />
                </div>
              )}
              {otherPoems.map((poem, idx) => (
                <PoemCard key={poem._id} poem={poem as any} index={idx + 1} />
              ))}
            </div>
          </div>
        )}

        {/* LYRICS section */}
        {lyrics.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-500)] font-medium mb-1">
                  লিরিক্স
                </p>
                <h3 className="font-bangla text-2xl font-semibold text-[var(--color-ink-800)]">
                  সাম্প্রতিক গান
                </h3>
              </div>
              <Link
                href="/lyrics"
                className="group hidden md:inline-flex items-center gap-2 text-sm text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] transition-colors"
              >
                সব লিরিক্স
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {featuredLyric && (
                <div className="md:col-span-2 lg:col-span-1">
                  <LyricCard lyric={featuredLyric as any} index={0} />
                </div>
              )}
              {otherLyrics.map((lyric, idx) => (
                <LyricCard key={lyric._id} lyric={lyric as any} index={idx + 1} />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {poems.length === 0 && lyrics.length === 0 && (
          <div className="text-center py-16 text-[var(--color-ink-400)]">
            <p className="font-bangla">এখনো কোনো সৃষ্টি প্রকাশিত হয়নি।</p>
          </div>
        )}
      </div>
    </section>
  );
}