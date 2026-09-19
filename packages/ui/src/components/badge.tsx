//packages/ui/src/components/badge.tsx
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-[var(--color-green-deep)] text-[var(--color-cream-50)]',
        outline:
          'border-[var(--color-border)] text-[var(--color-ink-600)] bg-transparent',
        accent:
          'border-transparent bg-[var(--color-gold-400)] text-[var(--color-ink-900)]',
        muted:
          'border-transparent bg-[var(--color-cream-200)] text-[var(--color-ink-700)]',
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