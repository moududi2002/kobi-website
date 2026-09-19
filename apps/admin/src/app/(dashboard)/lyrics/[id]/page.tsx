// apps/admin/src/app/(dashboard)/lyrics/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import type { Category, Lyric } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { LyricForm } from '@/components/forms/LyricForm';

export default function EditLyricPage() {
  const params = useParams<{ id: string }>();
  const [lyric, setLyric] = useState<Lyric | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [l, cats] = await Promise.all([
          apiClient.get<Lyric>(`/admin/lyrics/${params.id}`),
          apiClient.get<Category[]>('/admin/categories?type=lyric'),
        ]);
        setLyric(l);
        setCategories(cats);
      } finally {
        setLoading(false);
      }
    })();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-[var(--color-admin-primary)]" />
      </div>
    );
  }

  if (!lyric) {
    return (
      <div className="text-center py-16 font-bangla text-[var(--color-admin-text-muted)]">
        লিরিক পাওয়া যায়নি
      </div>
    );
  }

  return <LyricForm initial={lyric} categories={categories} />;
}