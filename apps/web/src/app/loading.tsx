// apps/web/src/app/loading.tsx
import { Skeleton } from '@kobi/ui';

export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <section className="h-screen bg-[var(--color-green-deep)] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-2xl px-6">
          <Skeleton className="h-4 w-32 mx-auto bg-[var(--color-green-deep-soft)]" />
          <Skeleton className="h-16 w-full bg-[var(--color-green-deep-soft)]" />
          <Skeleton className="h-6 w-3/4 mx-auto bg-[var(--color-green-deep-soft)]" />
        </div>
      </section>

      {/* Intro skeleton */}
      <section className="container-literary py-24 grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <Skeleton className="aspect-[4/5] w-full max-w-sm" />
        </div>
        <div className="md:col-span-7 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="bg-[var(--color-cream-100)] py-24">
        <div className="container-literary">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-4 w-40 mx-auto mb-16" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-[5/4] w-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}