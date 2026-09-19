//apps/web/src/app/kobita/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { fetchPoems, fetchCategories } from '@/lib/api/endpoints';
import { PoemCard } from '@/components/content/PoemCard';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { SearchBar } from '@/components/shared/SearchBar';
import { FilterChips } from '@/components/shared/FilterChips';
import { Pagination } from '@/components/shared/Pagination';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'কবিতা সমগ্র',
  description: 'প্রকাশিত সব কবিতার সম্পূর্ণ সংগ্রহ।',
  openGraph: {
    title: 'কবিতা সমগ্র',
    description: 'প্রকাশিত সব কবিতার সম্পূর্ণ সংগ্রহ।',
  },
};

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    category?: string;
    sort?: string;
  }>;
}

export default async function KobitaPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10) || 1);
  const search = params.search || '';
  const category = params.category || '';
  const sort =
    (params.sort as 'latest' | 'oldest' | 'popular') || 'latest';

  const [poemsRes, categories] = await Promise.all([
    fetchPoems({ page, limit: 12, search, category, sort }).catch(() => ({
      data: [],
      meta: { total: 0, page: 1, limit: 12, totalPages: 0, hasNext: false, hasPrev: false },
    })),
    fetchCategories('poem').catch(() => []),
  ]);

  const totalPages = poemsRes.meta?.totalPages ?? 0;
  const total = poemsRes.meta?.total ?? 0;

  return (
    <>
      {/* Hero header */}
      <section className="relative pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.15]" />
        <div className="relative container-literary">
          <Breadcrumb
            items={[
              { label: 'হোম', href: '/' },
              { label: 'কবিতা সমগ্র' },
            ]}
            className="mb-8"
          />

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
              কাব্য সংগ্রহ
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-[var(--color-green-deep)] leading-tight mb-6">
              কবিতা সমগ্র
            </h1>
            <IslamicDivider className="max-w-xs mx-auto" />
            <p className="mt-6 text-[var(--color-ink-600)] font-bangla text-base md:text-lg leading-relaxed">
              সময়ের স্রোতে লেখা সব কবিতা — একটি সম্পূর্ণ ডিজিটাল সংগ্রহ
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="sticky top-16 md:top-20 z-30 bg-[var(--color-cream-50)]/95 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="container-literary py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <SearchBar placeholder="কবিতা খুঁজুন…" className="md:max-w-xs" />
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

          {/* Result count */}
          {total > 0 && (
            <p className="mt-3 text-xs text-[var(--color-ink-400)]">
              মোট {total.toString().replace(/\d/g, (d: string) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)])}টি কবিতা
              {search && ` — "${search}" এর জন্য`}
            </p>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <div className="container-literary">
          {poemsRes.data.length === 0 ? (
            <EmptyState search={search} />
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {poemsRes.data.map((poem, idx) => (
                  <PoemCard key={poem._id} poem={poem as any} index={idx} />
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

function EmptyState({ search }: { search: string }) {
  return (
    <div className="text-center py-24 max-w-md mx-auto">
      <p className="font-display text-6xl text-[var(--color-gold-400)] mb-6 opacity-60">
        ❦
      </p>
      <h2 className="font-bangla text-2xl font-semibold text-[var(--color-green-deep)] mb-3">
        কোনো কবিতা পাওয়া যায়নি
      </h2>
      <p className="text-[var(--color-ink-500)] font-bangla">
        {search
          ? `"${search}" — এই শব্দে কোনো কবিতা নেই। অন্য কিছু খুঁজুন।`
          : 'এখনো কোনো কবিতা প্রকাশিত হয়নি।'}
      </p>
      {search && (
        <Link
          href="/kobita"
          className="mt-6 inline-block text-sm text-[var(--color-green-deep)] border-b border-current pb-1 hover:text-[var(--color-gold-600)] transition-colors"
        >
          সব কবিতা দেখুন
        </Link>
      )}
    </div>
  );
}