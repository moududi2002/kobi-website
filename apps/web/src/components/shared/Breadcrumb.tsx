// apps/web/src/components/shared/Breadcrumb.tsx
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@kobi/ui';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: Props) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm flex-wrap', className)}
    >
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <span key={idx} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-[var(--color-ink-500)] hover:text-[var(--color-green-deep)] transition-colors font-bangla"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  'font-bangla',
                  isLast
                    ? 'text-[var(--color-green-deep)] font-medium'
                    : 'text-[var(--color-ink-500)]',
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight className="w-3.5 h-3.5 text-[var(--color-ink-300)] shrink-0" />
            )}
          </span>
        );
      })}
    </nav>
  );
}