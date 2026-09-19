//apps/admin/src/components/ui/label.tsx
'use client';

import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cn } from '@kobi/ui';

export const Label = React.forwardRef<
  React.ComponentRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'block text-xs uppercase tracking-wider font-medium text-[var(--color-admin-text-muted)] mb-2 font-bangla',
      className,
    )}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;