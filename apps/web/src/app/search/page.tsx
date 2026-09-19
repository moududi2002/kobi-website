//apps/web/src/app/search/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { searchAll } from '@/lib/api/endpoints';
import { SearchBar } from '@/components/shared/SearchBar';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { IslamicDivider } from '@/components/shared/IslamicDivider';
import { PoemCard } from '@/components/content/PoemCard';
import { LyricCard } from '@/components/content/LyricCard';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'অনুসন্ধান',
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: Promise<{ q?: string; type?: 'all' | 'poem' | 'lyric' }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = (sp.q || '').trim();
  const type = sp.type || 'all';

  let results: any = null;
  if (q.length >= 2) {
    results = await searchAll(q, type).catch(() => null);
  }

  const totalPoems = results?.poems?.total ?? 0;
  const totalLyrics = results?.lyrics?.total ?? 0;
  const hasResults = totalPoems + totalLyrics > 0;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.15]" />
        <div className="relative container-literary">
          <Breadcrumb
            items={[{ label: 'হোম', href: '/' }, { label: 'অনুসন্ধান' }]}
            className="mb-8"
          />

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
              অনুসন্ধান
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--color-green-deep)] leading-tight mb-6">
              খুঁজুন
            </h1>
            <IslamicDivider className="max-w-xs mx-auto" />

            <div className="mt-8 flex justify-center">
              <SearchBar placeholder="কবিতা বা গানের লাইন খুঁজুন…" className="max-w-lg" />
            </div>

            {/* Type filters */}
            <div className="mt-6 flex justify-center gap-2">
              {[
                { label: 'সব', value: 'all' },
                { label: 'কবিতা', value: 'poem' },
                { label: 'লিরিক্স', value: 'lyric' },
              ].map((opt) => {
                const active = type === opt.value;
                const href = q
                  ? `/search?q=${encodeURIComponent(q)}&type=${opt.value}`
                  : `/search?type=${opt.value}`;
                return (
                  <Link
                    key={opt.value}
                    href={href}
                    className={`px-4 py-1.5 rounded-full text-sm font-bangla transition-all duration-300 border ${
                      active
                        ? 'bg-[var(--color-green-deep)] text-[var(--color-cream-50)] border-[var(--color-green-deep)]'
                        : 'text-[var(--color-ink-600)] border-[var(--color-border)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)]'
                    }`}
                  >
                    {opt.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-16">
        <div className="container-literary">
          {!q && (
            <div className="text-center py-16">
              <p className="font-bangla text-[var(--color-ink-500)]">
                কিছু লিখে অনুসন্ধান করুন
              </p>
            </div>
          )}

          {q && q.length < 2 && (
            <div className="text-center py-16">
              <p className="font-bangla text-[var(--color-ink-500)]">
                অন্তত ২ অক্ষর দিয়ে অনুসন্ধান করুন
              </p>
            </div>
          )}

          {q && q.length >= 2 && !hasResults && (
            <div className="text-center py-24 max-w-md mx-auto">
              <p className="font-display text-6xl text-[var(--color-gold-400)] mb-6 opacity-60">
                ❦
              </p>
              <h2 className="font-bangla text-2xl font-semibold text-[var(--color-green-deep)] mb-3">
                কিছু পাওয়া যায়নি
              </h2>
              <p className="text-[var(--color-ink-500)] font-bangla">
                "{q}" — এই শব্দে কোনো কবিতা বা লিরিক নেই।
              </p>
            </div>
          )}

          {hasResults && (
            <>
              <div className="mb-10 flex items-baseline justify-between flex-wrap gap-2">
                <p className="text-sm text-[var(--color-ink-500)] font-bangla">
                  "<span className="text-[var(--color-green-deep)] font-medium">{q}</span>" এর জন্য {totalPoems + totalLyrics}টি ফলাফল
                </p>
              </div>

              {/* Poems */}
              {totalPoems > 0 && (
                <div className="mb-16">
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-500)] font-medium mb-1">
                        কাব্য
                      </p>
                      <h2 className="font-bangla text-2xl font-semibold text-[var(--color-ink-800)]">
                        কবিতা ({totalPoems})
                      </h2>
                    </div>
                    <Link
                      href={`/kobita?search=${encodeURIComponent(q)}`}
                      className="text-sm text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)]"
                    >
                      সব দেখুন →
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.poems.items.slice(0, 6).map((p: any, idx: number) => (
                      <PoemCard key={p._id} poem={p} index={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* Lyrics */}
              {totalLyrics > 0 && (
                <div>
                  <div className="flex items-end justify-between mb-8">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-ink-500)] font-medium mb-1">
                        লিরিক্স
                      </p>
                      <h2 className="font-bangla text-2xl font-semibold text-[var(--color-ink-800)]">
                        গান ({totalLyrics})
                      </h2>
                    </div>
                    <Link
                      href={`/lyrics?search=${encodeURIComponent(q)}`}
                      className="text-sm text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)]"
                    >
                      সব দেখুন →
                    </Link>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.lyrics.items.slice(0, 6).map((l: any, idx: number) => (
                      <LyricCard key={l._id} lyric={l} index={idx} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}