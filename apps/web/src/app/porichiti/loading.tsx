//apps/web/src/app/porichiti/loading.tsx
import { Skeleton } from '@kobi/ui';

export default function Loading() {
  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 bg-[var(--color-cream-100)]">
        <div className="container-literary text-center max-w-2xl mx-auto">
          <Skeleton className="h-4 w-24 mx-auto mb-4" />
          <Skeleton className="h-14 w-2/3 mx-auto mb-6" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
        </div>
      </section>
      <section className="container-literary py-16 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Skeleton className="aspect-[4/5] w-full max-w-sm" />
        </div>
        <div className="md:col-span-7 space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-32 w-full mt-8" />
        </div>
      </section>
    </>
  );
}