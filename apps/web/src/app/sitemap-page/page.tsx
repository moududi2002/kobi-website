//apps/web/src/app/sitemap-page/page.tsx
import type { Metadata } from 'next';
import Link from 'next/link';

import { fetchPoems, fetchLyrics, fetchCategories } from '@/lib/api/endpoints';
import { Breadcrumb } from '@/components/shared/Breadcrumb';
import { IslamicDivider } from '@/components/shared/IslamicDivider';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'সাইটম্যাপ',
  robots: { index: true, follow: true },
};

export default async function SitemapPage() {
  const [poemsRes, lyricsRes, poemCats, lyricCats] = await Promise.all([
    fetchPoems({ limit: 100 }).catch(() => ({ data: [], meta: null })),
    fetchLyrics({ limit: 100 }).catch(() => ({ data: [], meta: null })),
    fetchCategories('poem').catch(() => []),
    fetchCategories('lyric').catch(() => []),
  ]);

  return (
    <>
      <section className="relative pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)] overflow-hidden">
        <div className="absolute inset-0 pattern-islamic-soft opacity-[0.15]" />
        <div className="relative container-literary">
          <Breadcrumb
            items={[{ label: 'হোম', href: '/' }, { label: 'সাইটম্যাপ' }]}
            className="mb-8"
          />
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-[var(--color-green-deep)] mb-6">
              সাইটম্যাপ
            </h1>
            <IslamicDivider className="max-w-xs mx-auto" />
            <p className="mt-6 text-[var(--color-ink-600)] font-bangla">
              পুরো সাইটের সব লিংক এক জায়গায়
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-literary grid md:grid-cols-2 gap-12">
          {/* Main pages */}
          <div>
            <h2 className="font-bangla text-xl font-semibold text-[var(--color-green-deep)] mb-4">
              মূল পৃষ্ঠা
            </h2>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'হোম' },
                { href: '/kobita', label: 'কবিতা সমগ্র' },
                { href: '/lyrics', label: 'লিরিক্স' },
                { href: '/porichiti', label: 'পরিচিতি' },
                { href: '/jogajog', label: 'যোগাযোগ' },
                { href: '/search', label: 'অনুসন্ধান' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] font-bangla text-sm"
                  >
                    → {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h2 className="font-bangla text-xl font-semibold text-[var(--color-green-deep)] mb-4">
              বিভাগ
            </h2>
            <ul className="space-y-2">
              {[...poemCats, ...lyricCats].map((c) => (
                <li key={c._id}>
                  <Link
                    href={
                      c.type === 'poem'
                        ? `/kobita/category/${c.slug}`
                        : `/lyrics/category/${c.slug}`
                    }
                    className="text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] font-bangla text-sm"
                  >
                    → {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Poems */}
          {poemsRes.data.length > 0 && (
            <div className="md:col-span-2">
              <h2 className="font-bangla text-xl font-semibold text-[var(--color-green-deep)] mb-4">
                সব কবিতা ({poemsRes.data.length})
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                {poemsRes.data.map((p) => (
                  <li key={p._id}>
                    <Link
                      href={`/kobita/${p.slug}`}
                      className="text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] font-bangla text-sm truncate block"
                    >
                      → {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Lyrics */}
          {lyricsRes.data.length > 0 && (
            <div className="md:col-span-2">
              <h2 className="font-bangla text-xl font-semibold text-[var(--color-green-deep)] mb-4">
                সব লিরিক ({lyricsRes.data.length})
              </h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2">
                {lyricsRes.data.map((l) => (
                  <li key={l._id}>
                    <Link
                      href={`/lyrics/${l.slug}`}
                      className="text-[var(--color-ink-600)] hover:text-[var(--color-green-deep)] font-bangla text-sm truncate block"
                    >
                      → {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}