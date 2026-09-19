//apps/admin/src/components/ui/button.tsx
import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@kobi/ui';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-admin-primary)] text-white hover:bg-[var(--color-admin-primary-hover)]',
        outline:
          'border border-[var(--color-admin-border)] bg-white hover:bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text)]',
        ghost:
          'hover:bg-[var(--color-admin-surface-hover)] text-[var(--color-admin-text)]',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
        accent:
          'bg-[var(--color-admin-accent)] text-white hover:bg-[var(--color-admin-accent)]/90',
        link: 'text-[var(--color-admin-primary)] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4',
        lg: 'h-11 px-6',
        icon: 'h-9 w-9',
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