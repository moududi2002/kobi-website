// apps/api/src/schemas/site-settings.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type SiteSettingsDocument = HydratedDocument<SiteSettings>;

export const SITE_SETTINGS_SINGLETON_ID = 'singleton-settings';

@Schema({ _id: false })
class SiteSocialLink {
  @Prop({ type: String, required: true })
  platform: string;

  @Prop({ type: String, required: true })
  url: string;
}

@Schema({
  timestamps: true,
  collection: 'site_settings',
  versionKey: false,
})
export class SiteSettings extends Document {
  @Prop({
    type: String,
    default: SITE_SETTINGS_SINGLETON_ID,
    unique: true,
    index: true,
  })
  singletonKey: string;

  @Prop({ type: String, required: true, default: 'কবির নাম' })
  siteName: string;

  @Prop({ type: String, default: '' })
  siteDescription: string;

  @Prop({ type: String, default: null })
  logo?: string | null;

  @Prop({ type: String, default: null })
  favicon?: string | null;

  @Prop({ type: String, default: '' })
  contactEmail?: string;

  @Prop({ type: String, default: '' })
  contactPhone?: string;

  @Prop({ type: [SiteSocialLink], default: [] })
  socialLinks: SiteSocialLink[];

  @Prop({ type: [String], default: [] })
  metaKeywords: string[];

  createdAt: Date;
  updatedAt: Date;
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);