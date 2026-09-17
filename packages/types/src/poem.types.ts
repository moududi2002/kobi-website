// packages/types/src/poem.types.ts
import { ContentStatus } from './common.types';

export interface Poem {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // HTML from TipTap
  contentPlain?: string; // plain text for search
  coverImage?: string;
  category?: string;
  tags: string[];
  status: ContentStatus;
  publishedAt?: string;
  featured: boolean;
  viewCount: number;
  readingTimeMinutes?: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePoemDto {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  category?: string;
  tags?: string[];
  status?: ContentStatus;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export type UpdatePoemDto = Partial<CreatePoemDto>;