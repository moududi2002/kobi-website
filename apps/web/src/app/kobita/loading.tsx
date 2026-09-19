// apps/web/src/app/kobita/loading.tsx
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
      <section className="py-16">
        <div className="container-literary grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[5/4] w-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}