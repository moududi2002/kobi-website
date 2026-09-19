//apps/admin/src/components/ui/input.tsx
import * as React from 'react';
import { cn } from '@kobi/ui';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full h-10 px-3.5 rounded-md border border-[var(--color-admin-border)] bg-white text-sm text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-subtle)] focus:border-[var(--color-admin-accent)] focus:outline-none transition-colors disabled:opacity-60 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = 'Input';