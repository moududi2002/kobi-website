//apps/admin/src/components/ui/textarea.tsx
import * as React from 'react';
import { cn } from '@kobi/ui';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3.5 py-2.5 rounded-md border border-[var(--color-admin-border)] bg-white text-sm text-[var(--color-admin-text)] placeholder:text-[var(--color-admin-text-subtle)] focus:border-[var(--color-admin-accent)] focus:outline-none transition-colors resize-y min-h-[80px] disabled:opacity-60',
        className,
      )}
      {...props}
    />
  ),
);
Textarea.displayName = 'Textarea';