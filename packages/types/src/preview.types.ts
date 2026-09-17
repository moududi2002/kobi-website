// packages/types/src/preview.types.ts
export type PreviewContentType = 'poem' | 'lyric' | 'about' | 'homepage';

export interface PreviewToken {
  _id: string;
  token: string;
  contentType: PreviewContentType;
  contentId: string;
  expiresAt: string;
  createdBy: string;
  createdAt: string;
}