//apps/admin/src/lib/api/endpoints.ts
import { apiClient } from './client';
import type {
  User,
  Poem,
  Lyric,
  Category,
  About,
  Homepage,
  SiteSettings,
} from '@kobi/types';

// ---------------- Auth ----------------
export interface LoginResult {
  user: User;
  accessToken: string;
  expiresIn: number;
}

export async function login(email: string, password: string) {
  return apiClient.post<LoginResult>(
    '/auth/login',
    { email, password },
    { skipAuth: true },
  );
}

export async function logout() {
  return apiClient.post<{ success: boolean }>('/auth/logout', undefined, {
    skipAuth: true,
  });
}

export async function fetchMe() {
  return apiClient.get<User>('/auth/me');
}

// ---------------- Dashboard ----------------
export interface DashboardStats {
  totalPoems: number;
  publishedPoems: number;
  draftPoems: number;
  totalLyrics: number;
  publishedLyrics: number;
  draftLyrics: number;
  newMessages: number;
  totalMedia: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  // Compose from individual endpoints (public + admin)
  const [poems, lyrics, draftPoems, draftLyrics, newMessages] = await Promise.all([
    apiClient.get<{ data: any[]; meta: { total: number } }>(
      '/admin/poems?limit=1',
    ),
    apiClient.get<{ data: any[]; meta: { total: number } }>(
      '/admin/lyrics?limit=1',
    ),
    apiClient.get<{ data: any[]; meta: { total: number } }>(
      '/admin/poems?limit=1&status=draft',
    ),
    apiClient.get<{ data: any[]; meta: { total: number } }>(
      '/admin/lyrics?limit=1&status=draft',
    ),
    apiClient.get<{ count: number }>('/admin/contact/count-new'),
  ]);

  return {
    totalPoems: poems.meta.total,
    publishedPoems: poems.meta.total - draftPoems.meta.total,
    draftPoems: draftPoems.meta.total,
    totalLyrics: lyrics.meta.total,
    publishedLyrics: lyrics.meta.total - draftLyrics.meta.total,
    draftLyrics: draftLyrics.meta.total,
    newMessages: newMessages.count,
    totalMedia: 0,
  };
}

export interface RecentItem {
  _id: string;
  title: string;
  status: 'draft' | 'published' | 'archived';
  updatedAt: string;
  type: 'poem' | 'lyric';
}

export async function fetchRecentActivity(): Promise<RecentItem[]> {
  const [poems, lyrics] = await Promise.all([
    apiClient.get<{ data: any[]; meta: any }>(
      '/admin/poems?limit=5&sort=latest',
    ),
    apiClient.get<{ data: any[]; meta: any }>(
      '/admin/lyrics?limit=5&sort=latest',
    ),
  ]);

  const items: RecentItem[] = [
    ...poems.data.map((p) => ({
      _id: p._id,
      title: p.title,
      status: p.status,
      updatedAt: p.updatedAt,
      type: 'poem' as const,
    })),
    ...lyrics.data.map((l) => ({
      _id: l._id,
      title: l.title,
      status: l.status,
      updatedAt: l.updatedAt,
      type: 'lyric' as const,
    })),
  ];

  return items
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .slice(0, 8);
}