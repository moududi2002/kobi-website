// apps/web/src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { Button } from '@kobi/ui';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center container-literary">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl text-[var(--color-gold-500)] mb-4">
          ◆
        </p>
        <h1 className="text-3xl font-semibold mb-3 text-[var(--color-green-deep)]">
          কিছু একটা ভুল হয়েছে
        </h1>
        <p className="text-[var(--color-ink-500)] mb-8">
          দুঃখিত, পৃষ্ঠাটি লোড করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।
        </p>
        <Button onClick={reset} variant="default">
          আবার চেষ্টা করুন
        </Button>
      </div>
    </div>
  );
}