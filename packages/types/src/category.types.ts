// packages/types/src/category.types.ts
export interface Category {
  _id: string;
  name: string; // Bangla name
  nameEn: string;
  slug: string;
  description?: string;
  type: 'poem' | 'lyric';
  order: number;
  isSystem: boolean; // e.g. হামদ, নাতে রাসুল cannot be deleted
  createdAt: string;
  updatedAt: string;
}