// packages/types/src/media.types.ts
export interface MediaAsset {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  folder: string;
  uploadedBy: string;
  createdAt: string;
}