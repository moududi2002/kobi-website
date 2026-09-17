// packages/types/src/settings.types.ts
export interface SiteSettings {
  _id: string;
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  socialLinks: { platform: string; url: string }[];
  metaKeywords: string[];
  updatedAt: string;
}