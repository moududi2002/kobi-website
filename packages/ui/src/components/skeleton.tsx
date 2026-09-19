//packages/ui/src/components/skeleton.tsx
import { cn } from '../lib/utils';

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-[var(--color-cream-200)]',
        className,
      )}
      {...props}
    />
  );
}