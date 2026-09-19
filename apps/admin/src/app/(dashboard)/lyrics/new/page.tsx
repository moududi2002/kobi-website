//apps/admin/src/app/(dashboard)/lyrics/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import type { Category } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { LyricForm } from '@/components/forms/LyricForm';

export default function NewLyricPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<Category[]>(
          '/admin/categories?type=lyric',
        );
        setCategories(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-admin-primary)]" />
      </div>
    );
  }

  return <LyricForm categories={categories} />;
}