//apps/web/src/lib/api/endpoints.ts
import { apiClient } from './client';
import type { Poem, Lyric, Category, About, Homepage, SiteSettings } from '@kobi/types';

// ---------------- Types ----------------
export interface HomepageFullData {
  homepage: Homepage & {
    featuredPoem?: Poem | null;
    featuredLyric?: Lyric | null;
  };
  latestPoems: Poem[];
  latestLyrics: Lyric[];
  featuredPoems: Poem[];
  featuredLyrics: Lyric[];
  about: Pick<About, 'shortBio' | 'portraitImage' | 'literaryIdentity'> | null;
}

export interface ListQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  tag?: string;
  sort?: 'latest' | 'oldest' | 'popular';
  featured?: 'true' | 'false';
}

// ---------------- Homepage ----------------
/* export async function fetchHomepageFull() {
  return apiClient.get<HomepageFullData>('/homepage/full', {
    revalidate: 60,
    tags: ['homepage'],
  });
}
  */

// Backend না চললে homepage crash হওয়া থেকে বাঁচাতে helper
export async function fetchHomepageFull(): Promise<HomepageFullData> {
  try {
    return await apiClient.get<HomepageFullData>('/homepage/full', {
      revalidate: 60,
      tags: ['homepage'],
    });
  } catch (err) {
    console.warn('[fetchHomepageFull] fallback due to error:', err);
    return {
      homepage: {
        heroSlides: [],
        featuredPoem: null,
        featuredLyric: null,
        welcomeQuote: '',
      } as any,
      latestPoems: [],
      latestLyrics: [],
      featuredPoems: [],
      featuredLyrics: [],
      about: null,
    };
  }
}

// ---------------- About ----------------
export async function fetchAbout() {
  return apiClient.get<About>('/about', {
    revalidate: 3600,
    tags: ['about'],
  });
}

// ---------------- Settings ----------------
export async function fetchSettings() {
  return apiClient.get<SiteSettings>('/settings', {
    revalidate: 3600,
    tags: ['settings'],
  });
}

// ---------------- Categories ----------------
export async function fetchCategories(type?: 'poem' | 'lyric') {
  const qs = type ? `?type=${type}` : '';
  return apiClient.get<Category[]>(`/categories${qs}`, {
    revalidate: 3600,
    tags: ['categories'],
  });
}

// ---------------- Poems ----------------
export async function fetchPoems(query: ListQuery = {}) {
  const qs = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });
  return apiClient.get<{ data: Poem[]; meta: any }>(
    `/poems?${qs.toString()}`,
    { revalidate: 60, tags: ['poems'] },
  );
}

export async function fetchPoemBySlug(slug: string) {
  return apiClient.get<Poem>(`/poems/${encodeURIComponent(slug)}`, {
    revalidate: 60,
    tags: ['poems', `poem:${slug}`],
  });
}

export async function fetchFeaturedPoems() {
  return apiClient.get<Poem[]>('/poems/featured', {
    revalidate: 60,
    tags: ['poems'],
  });
}

// ---------------- Lyrics ----------------
export async function fetchLyrics(query: ListQuery = {}) {
  const qs = new URLSearchParams();
  Object.entries(query).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qs.set(k, String(v));
  });
  return apiClient.get<{ data: Lyric[]; meta: any }>(
    `/lyrics?${qs.toString()}`,
    { revalidate: 60, tags: ['lyrics'] },
  );
}

export async function fetchLyricBySlug(slug: string) {
  return apiClient.get<Lyric>(`/lyrics/${encodeURIComponent(slug)}`, {
    revalidate: 60,
    tags: ['lyrics', `lyric:${slug}`],
  });
}

export async function fetchFeaturedLyrics() {
  return apiClient.get<Lyric[]>('/lyrics/featured', {
    revalidate: 60,
    tags: ['lyrics'],
  });
}

// ---------------- Search ----------------
export interface SearchResult {
  query: string;
  type: string;
  poems: { items: Poem[]; total: number };
  lyrics: { items: Lyric[]; total: number };
  meta: { page: number; limit: number };
}

export async function searchAll(q: string, type: 'all' | 'poem' | 'lyric' = 'all') {
  const qs = new URLSearchParams({ q, type });
  return apiClient.get<SearchResult>(`/search?${qs.toString()}`, {
    cache: 'no-store',
  });
}

// ---------------- Sitemap / RSS ----------------
export interface SitemapEntry {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
}

export async function fetchSitemapData() {
  return apiClient.get<SitemapEntry[]>('/seo/sitemap-data', {
    cache: 'no-store',
  });
}

export interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  type: 'poem' | 'lyric';
}

export async function fetchRssData() {
  return apiClient.get<RssItem[]>('/seo/rss-data', {
    cache: 'no-store',
  });
}

export interface ContactMessageInput {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string; // honeypot
}

export async function sendContactMessage(input: ContactMessageInput) {
  return apiClient.post<{ success: boolean; id: string }>('/contact', input, {
    cache: 'no-store',
  });
}