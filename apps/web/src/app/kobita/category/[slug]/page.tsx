//apps/web/src/app/kobita/category/[slug]/page.tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

import { fetchPoems, fetchCategories } from '@/lib/api/endpoints';
import { PoemCard } from '@/components/content/PoemCard';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { Pagination } from '@/components/shared/Pagination';
import { IslamicDivider } from '@/components/shared/IslamicDivider';
import { apiClient } from '@/lib/api/client';

export const revalidate = 60;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

async function getCategory(slug: string) {
  try {
    return await apiClient.get<any>(`/categories/${encodeURIComponent(slug)}`, {
      revalidate: 3600,
      tags: ['categories'],
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return { title: 'Category' };
  return {
    title: `${cat.name} — কবিতা`,
    description: cat.description || `${cat.name} বিভাগের সব কবিতা`,
  };
}

export default async function PoemCategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || '1', 10) || 1);

  const cat = await getCategory(slug);
  if (!cat || cat.type !== 'poem') notFound();

  const poemsRes = await fetchPoems({
    page,
    limit: 12,
    category: cat._id,
  }).catch(() => ({
    data: [],
    meta: { total: 0, page: 1, limit: 12, totalPages: 0, hasNext: false, hasPrev: false },
  }));

  return (
    <>
      <section className="relative pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.15]" />
        <div className="relative container-literary">
          <Breadcrumb
            items={[
              { label: 'হোম', href: '/' },
              { label: 'কবিতা সমগ্র', href: '/kobita' },
              { label: cat.name },
            ]}
            className="mb-8"
          />

          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium mb-4">
              কাব্য বিভাগ
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--color-green-deep)] leading-tight mb-4">
              {cat.name}
            </h1>
            <p className="text-xs uppercase tracking-wider text-[var(--color-ink-400)] mb-5">
              {cat.nameEn}
            </p>
            <IslamicDivider className="max-w-xs mx-auto" />
            {cat.description && (
              <p className="mt-6 text-[var(--color-ink-600)] font-bangla text-base md:text-lg">
                {cat.description}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="container-literary">
          {poemsRes.data.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-bangla text-lg text-[var(--color-ink-500)]">
                এই বিভাগে এখনো কোনো কবিতা প্রকাশিত হয়নি।
              </p>
              <Link
                href="/kobita"
                className="mt-6 inline-block text-sm text-[var(--color-green-deep)] border-b border-current pb-1"
              >
                সব কবিতা দেখুন
              </Link>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                {poemsRes.data.map((poem, idx) => (
                  <PoemCard key={poem._id} poem={poem as any} index={idx} />
                ))}
              </div>
              <Pagination currentPage={page} totalPages={poemsRes.meta?.totalPages ?? 0} />
            </>
          )}
        </div>
      </section>
    </>
  );
}