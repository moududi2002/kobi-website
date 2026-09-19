//apps/web/src/components/content/ViewTracker.tsx
'use client';

import { useViewCount } from '@/hooks/useViewCount';

interface Props {
  type: 'poems' | 'lyrics';
  slug: string;
}

export function ViewTracker({ type, slug }: Props) {
  useViewCount(type, slug);
  return null;
}