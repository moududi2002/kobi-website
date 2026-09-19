//apps/web/src/components/shared/Pagination.tsx
'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@kobi/ui';
import { toBengaliDigits } from '@kobi/utils';

interface Props {
  currentPage: number;
  totalPages: number;
  className?: string;
}

export function Pagination({ currentPage, totalPages, className }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const buildHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) params.delete('page');
    else params.set('page', String(page));
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  // Generate page numbers (max 7 shown)
  const pages: (number | '...')[] = [];
  const addPage = (p: number) => pages.push(p);

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) addPage(i);
  } else {
    addPage(1);
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) addPage(i);
    if (currentPage < totalPages - 2) pages.push('...');
    addPage(totalPages);
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn('flex items-center justify-center gap-2 py-12', className)}
    >
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={buildHref(currentPage - 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-ink-600)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors"
          aria-label="আগের পৃষ্ঠা"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-ink-300)] opacity-40 cursor-not-allowed">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {pages.map((p, idx) => {
          if (p === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                className="px-3 text-[var(--color-ink-400)]"
              >
                …
              </span>
            );
          }
          const isActive = p === currentPage;
          return (
            <Link
              key={p}
              href={buildHref(p)}
              className={cn(
                'inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bangla transition-all duration-300',
                isActive
                  ? 'bg-[var(--color-green-deep)] text-[var(--color-cream-50)] shadow-[var(--shadow-soft)]'
                  : 'text-[var(--color-ink-600)] hover:bg-[var(--color-cream-200)]',
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {toBengaliDigits(p)}
            </Link>
          );
        })}
      </div>

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={buildHref(currentPage + 1)}
          className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-ink-600)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)] transition-colors"
          aria-label="পরের পৃষ্ঠা"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--color-border)] text-[var(--color-ink-300)] opacity-40 cursor-not-allowed">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}