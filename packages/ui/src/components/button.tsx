//packages/ui/src/components/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-green-deep-soft)] shadow-sm',
        outline:
          'border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-cream-100)] text-[var(--color-foreground)]',
        ghost:
          'bg-transparent hover:bg-[var(--color-cream-100)] text-[var(--color-foreground)]',
        accent:
          'bg-[var(--color-gold-500)] text-[var(--color-ink-900)] hover:bg-[var(--color-gold-400)] shadow-sm',
        link:
          'bg-transparent text-[var(--color-primary)] underline-offset-4 hover:underline p-0 h-auto',
        destructive:
          'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-xs',
        default: 'h-10 px-5',
        lg: 'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { buttonVariants };