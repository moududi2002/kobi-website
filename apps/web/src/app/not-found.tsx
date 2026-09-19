import Link from 'next/link';
import { Button } from '@kobi/ui';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center container-literary">
      <div className="text-center max-w-md">
        <p className="font-display text-8xl text-[var(--color-gold-500)] mb-4">
          ৪০৪
        </p>
        <h1 className="text-2xl font-semibold mb-3 text-[var(--color-green-deep)]">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-[var(--color-ink-500)] mb-8">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা সরিয়ে ফেলা হয়েছে বা কখনও ছিল না।
        </p>
        <Button asChild>
          <Link href="/">হোমে ফিরে যান</Link>
        </Button>
      </div>
    </div>
  );
}