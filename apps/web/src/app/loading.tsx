// apps/web/src/app/loading.tsx
import { Skeleton } from '@kobi/ui';

export default function Loading() {
  return (
    <div className="container-literary py-32">
      <div className="space-y-6 max-w-3xl mx-auto">
        <Skeleton className="h-12 w-2/3 mx-auto" />
        <Skeleton className="h-6 w-1/2 mx-auto" />
        <Skeleton className="h-64 w-full mt-12" />
      </div>
    </div>
  );
}