//apps/web/src/components/shared/IslamicDivider.tsx
import { cn } from '@kobi/ui';

interface Props {
  className?: string;
  children?: React.ReactNode;
}

export function IslamicDivider({ className, children }: Props) {
  return (
    <div className={cn('divider-ornament py-4', className)}>
      <span className="text-[var(--color-gold-500)] text-sm">
        {children ?? '◆'}
      </span>
    </div>
  );
}