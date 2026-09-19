//apps/admin/src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-[var(--color-admin-accent)] mb-4">
          ৪০৪
        </p>
        <h1 className="font-bangla text-xl font-semibold text-[var(--color-admin-primary)] mb-3">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-sm text-[var(--color-admin-text-muted)] font-bangla mb-6">
          আপনি যে পৃষ্ঠাটি খুঁজছেন তা নেই বা সরানো হয়েছে।
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 rounded-md bg-[var(--color-admin-primary)] text-white text-sm font-medium hover:bg-[var(--color-admin-primary-hover)] transition-colors font-bangla"
        >
          ড্যাশবোর্ডে ফিরে যান
        </Link>
      </div>
    </div>
  );
}