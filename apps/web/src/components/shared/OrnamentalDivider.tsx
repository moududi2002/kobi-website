//apps/web/src/components/shared/OrnamentalDivider.tsx
import { cn } from '@kobi/ui';

interface Props {
  className?: string;
  label?: string;
}

export function OrnamentalDivider({ className, label }: Props) {
  return (
    <div className={cn('flex items-center gap-4 py-8', className)}>
      <span className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-gold-400)]" />
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-[var(--color-gold-500)]"
      >
        <path
          d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
          fill="currentColor"
          opacity="0.8"
        />
      </svg>
      {label && (
        <span className="text-xs uppercase tracking-[0.25em] text-[var(--color-gold-600)] font-medium">
          {label}
        </span>
      )}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        className="text-[var(--color-gold-500)]"
      >
        <path
          d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
          fill="currentColor"
          opacity="0.8"
        />
      </svg>
      <span className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-gold-400)]" />
    </div>
  );
}