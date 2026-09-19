// apps/admin/src/app/(dashboard)/poems/new/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import type { Category } from '@kobi/types';
import { apiClient } from '@/lib/api/client';
import { PoemForm } from '@/components/forms/PoemForm';

export default function NewPoemPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiClient.get<Category[]>(
          '/admin/categories?type=poem',
        );
        setCategories(res);
      } catch {
        // ignore
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

  return <PoemForm categories={categories} />;
}