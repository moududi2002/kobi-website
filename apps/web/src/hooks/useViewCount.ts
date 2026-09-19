//apps/web/src/hooks/useViewCount.ts
'use client';

import { useEffect } from 'react';

const STORAGE_KEY = 'viewed_items';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ViewedMap {
  [key: string]: number; // slug → timestamp
}

/**
 * Increment view count for a poem/lyric.
 * Only fires once per session per item (deduped via sessionStorage).
 */
export function useViewCount(type: 'poems' | 'lyrics', slug: string) {
  useEffect(() => {
    if (!slug) return;
    if (typeof window === 'undefined') return;

    try {
      const key = `${type}:${slug}`;
      const raw = sessionStorage.getItem(STORAGE_KEY);
      const viewed: ViewedMap = raw ? JSON.parse(raw) : {};

      const last = viewed[key];
      const now = Date.now();
      // Skip if already viewed within last 12 hours
      if (last && now - last < 12 * 60 * 60 * 1000) return;

      viewed[key] = now;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(viewed));

      // Fire-and-forget
      fetch(
        `${API_URL}/api/v1/${type}/${encodeURIComponent(slug)}/view`,
        { method: 'POST', keepalive: true },
      ).catch(() => {
        // Ignore errors silently — view count is not critical
      });
    } catch {
      // Ignore
    }
  }, [type, slug]);
}