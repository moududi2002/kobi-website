//apps/web/src/components/shared/FilterChips.tsx
'use client';

import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { cn } from '@kobi/ui';

export interface FilterOption {
  label: string;
  value: string;
}

interface Props {
  options: FilterOption[];
  paramName: string;
  className?: string;
}

export function FilterChips({ options, paramName, className }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get(paramName) || '';

  const buildHref = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(paramName, value);
    else params.delete(paramName);
    params.delete('page');
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Link
        href={buildHref('')}
        className={cn(
          'px-4 py-1.5 rounded-full text-sm font-bangla transition-all duration-300 border',
          !current
            ? 'bg-[var(--color-green-deep)] text-[var(--color-cream-50)] border-[var(--color-green-deep)]'
            : 'text-[var(--color-ink-600)] border-[var(--color-border)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)]',
        )}
      >
        সব
      </Link>
      {options.map((opt) => {
        const isActive = current === opt.value;
        return (
          <Link
            key={opt.value}
            href={buildHref(opt.value)}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-bangla transition-all duration-300 border',
              isActive
                ? 'bg-[var(--color-green-deep)] text-[var(--color-cream-50)] border-[var(--color-green-deep)]'
                : 'text-[var(--color-ink-600)] border-[var(--color-border)] hover:border-[var(--color-gold-400)] hover:text-[var(--color-green-deep)]',
            )}
          >
            {opt.label}
          </Link>
        );
      })}
    </div>
  );
}