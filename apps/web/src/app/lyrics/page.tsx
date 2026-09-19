// apps/web/src/app/lyrics/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { fetchLyrics, fetchCategories } from '@/lib/api/endpoints';
import { LyricCard } from '@/components/content/LyricCard';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterChips } from '@/components/shared/FilterChips';
import { Pagination } from '@/components/shared/Pagination';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'লিরিক্স সংগ্রহ',
  description: 'হামদ, নাতে রাসুল, মায়ের গান, দেশাত্মবোধক, রম্যসহ সব গান ও গজলের সংগ্রহ।',
};

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function LyricsPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const search = params.search || '';
  const category = params.category || '';
  const sort =
    (params.sort as 'latest' | 'oldest' | 'popular') || 'latest';

  const [lyricsRes, categories] = await Promise.all([
    fetchLyrics({ page, limit: 12, search, category, sort }).catch(() => ({
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0, hasNext: false, hasPrev: false },
    })),
    fetchCategories('lyric').catch(() => []),
  ]);

  const totalPages = lyricsRes.meta?.totalPages ?? 0;
  const total = lyricsRes.meta?.total ?? 0;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.15]" />
        <div className="relative container-literary">
          <Breadcrumb
            items={[{ label: 'হোম', href: '/' }, { label: 'লিরিক্স' }]}
            className="mb-8"
          />

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
              গান ও গজল
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--color-green-deep)] leading-tight mb-6">
              লিরিক্স সংগ্রহ
            </h1>
            <IslamicDivider className="max-w-xs mx-auto" />
            <p className="mt-6 text-[var(--color-ink-600)] font-bangla text-base md:text-lg leading-relaxed">
              হামদ, নাতে রাসুল, মায়ের গান, দেশাত্মবোধক ও রম্য — সব গানের সম্পূর্ণ সংগ্রহ
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-30 bg-[var(--color-cream-50)]/95 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="container-literary py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <SearchBar placeholder="লিরিক খুঁজুন…" className="md:max-w-xs" />
            {categories.length > 0 && (
              <FilterChips
                paramName="category"
                options={categories.map((c) => ({
                  label: c.name,
                  value: c._id,
                }))}
                className="flex-1 overflow-x-auto"
              />
            )}
          </div>

          {total > 0 && (
            <p className="mt-3 text-xs text-[var(--color-ink-400)]">
              মোট {total.toString().replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)])}টি লিরিক
              {search && ` — "${search}" এর জন্য`}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container-literary">
          {lyricsRes.data.length === 0 ? (
            <div className="text-center py-24 max-w-md mx-auto">
              <p className="font-display text-6xl text-[var(--color-gold-400)] mb-6 opacity-60">
                ♪
              </p>
              <h2 className="font-bangla text-2xl font-semibold text-[var(--color-green-deep)] mb-3">
                কোনো লিরিক পাওয়া যায়নি
              </h2>
              <p className="text-[var(--color-ink-500)] font-bangla">
                {search
                  ? `"${search}" — এই শব্দে কোনো লিরিক নেই।`
                  : 'এখনো কোনো লিরিক প্রকাশিত হয়নি।'}
              </p>
              {search && (
                <Link
                  href="/lyrics"
                  className="mt-6 inline-block text-sm text-[var(--color-green-deep)] border-b border-current pb-1"
                >
                  সব লিরিক দেখুন
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {lyricsRes.data.map((lyric, idx) => (
                  <LyricCard key={lyric._id} lyric={lyric as any} index={idx} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} />
            </>
          )}
        </div>
      </section>
    </>
  );
}