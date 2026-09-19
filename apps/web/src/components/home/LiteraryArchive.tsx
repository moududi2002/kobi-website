//apps/web/src/components/home/LiteraryArchive.tsx
import Link from 'next/link';
import { fetchCategories } from '@/lib/api/endpoints';
import { motion } from 'motion/react';
import { BookOpen, Music, Heart, Globe, Sparkles, Home } from 'lucide-react';

// Note: This becomes a client component if we animate with motion;
// let's split it — server component fetches, client renders.
// For simplicity in this phase, we make this a server component without motion.

import { IslamicDivider } from '@/components/shared/IslamicDivider';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  hamd: Sparkles,
  'nate-rasul': Heart,
  'mayer-gan': Heart,
  'deshatmobodhok': Globe,
  rommo: Music,
  poem: BookOpen,
};

export async function LiteraryArchive() {
  const [poemCats, lyricCats] = await Promise.all([
    fetchCategories('poem').catch(() => []),
    fetchCategories('lyric').catch(() => []),
  ]);

  const allCats = [...poemCats, ...lyricCats];

  return (
    <section className="relative py-24 md:py-32">
      <div className="container-literary">
        <div className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
            সংগ্রহ
          </p>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-[var(--color-green-deep)] leading-tight">
            সাহিত্য সংগ্রহ
          </h2>
          <IslamicDivider className="max-w-xs mx-auto mt-4" />
          <p className="mt-6 text-[var(--color-ink-500)] max-w-2xl mx-auto font-bangla text-base md:text-lg">
            বিষয় অনুযায়ী সাজানো সৃষ্টিকর্ম — এক জায়গায় সম্পূর্ণ সংগ্রহ
          </p>
        </div>

        {allCats.length === 0 ? (
          <div className="text-center py-12 text-[var(--color-ink-400)]">
            <p className="font-bangla">বিভাগ তৈরি হয়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6">
            {allCats.map((cat, idx) => {
              const Icon = ICON_MAP[cat.slug] || BookOpen;
              const href =
                cat.type === 'lyric'
                  ? `/lyrics/category/${cat.slug}`
                  : `/kobita/category/${cat.slug}`;

              return (
                <Link
                  key={cat._id}
                  href={href}
                  className="group relative p-6 md:p-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-cream-50)] hover:border-[var(--color-gold-400)] transition-all duration-500 hover:shadow-[var(--shadow-elevated)] overflow-hidden"
                >
                  {/* Ornament background on hover */}
                  <div className="absolute inset-0 pattern-islamic-soft opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[var(--color-cream-200)] group-hover:bg-[var(--color-gold-400)] flex items-center justify-center mb-5 transition-colors duration-500">
                      <Icon className="w-5 h-5 text-[var(--color-green-deep)] group-hover:text-[var(--color-cream-50)] transition-colors duration-500" />
                    </div>

                    <h3 className="font-bangla text-lg md:text-xl font-semibold text-[var(--color-ink-800)] group-hover:text-[var(--color-green-deep)] transition-colors">
                      {cat.name}
                    </h3>

                    <p className="mt-1 text-xs uppercase tracking-wider text-[var(--color-ink-400)]">
                      {cat.nameEn}
                    </p>

                    {cat.description && (
                      <p className="mt-3 text-sm text-[var(--color-ink-500)] line-clamp-2 font-bangla">
                        {cat.description}
                      </p>
                    )}

                    <span className="mt-5 inline-flex items-center gap-1 text-xs text-[var(--color-gold-600)] font-medium group-hover:gap-2 transition-all">
                      দেখুন →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}