// apps/web/src/app/kobita/[slug]/loading.tsx
import { Skeleton } from '@kobi/ui';

export default function Loading() {
  return (
    <article className="pt-32 md:pt-40">
      <div className="container-reading text-center">
        <Skeleton className="h-4 w-40 mx-auto mb-8" />
        <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
        <Skeleton className="h-6 w-1/2 mx-auto mb-12" />
      </div>
      <div className="container-reading space-y-6 py-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
        <Skeleton className="h-5 w-2/3" />
      </div>
    </article>
  );
}