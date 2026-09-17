// packages/types/src/about.types.ts
export interface About {
  _id: string;
  shortBio: string;
  fullBio: string; // HTML
  portraitImage?: string;
  literaryIdentity?: string;
  achievements: string[];
  timeline?: { year: string; title: string; description?: string }[];
  contactEmail?: string;
  contactPhone?: string;
  socialLinks: { platform: string; url: string }[];
  updatedAt: string;
}