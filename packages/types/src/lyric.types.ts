// packages/types/src/lyric.types.ts
import { ContentStatus } from './common.types';

export type LyricCategorySlug =
  | 'hamd'
  | 'nate-rasul'
  | 'mayer-gan'
  | 'deshatmobodhok'
  | 'rommo';

export interface Lyric {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // HTML lyrics
  contentPlain?: string;
  youtubeVideoId?: string;
  youtubeUrl?: string;
  category: LyricCategorySlug | string;
  tags: string[];
  status: ContentStatus;
  publishedAt?: string;
  featured: boolean;
  viewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLyricDto {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  youtubeUrl?: string;
  category: string;
  tags?: string[];
  status?: ContentStatus;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export type UpdateLyricDto = Partial<CreateLyricDto>;