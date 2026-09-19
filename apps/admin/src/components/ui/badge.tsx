// apps/admin/src/components/ui/badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@kobi/ui';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors font-bangla',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-admin-primary)]/10 text-[var(--color-admin-primary)]',
        accent:
          'bg-[var(--color-admin-accent)]/15 text-[var(--color-admin-accent)]',
        draft:
          'bg-[var(--color-status-draft-bg)] text-[var(--color-status-draft-fg)]',
        published:
          'bg-[var(--color-status-published-bg)] text-[var(--color-status-published-fg)]',
        archived:
          'bg-[var(--color-status-archived-bg)] text-[var(--color-status-archived-fg)]',
        destructive: 'bg-red-100 text-red-700',
        outline:
          'border border-[var(--color-admin-border)] text-[var(--color-admin-text-muted)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { badgeVariants };