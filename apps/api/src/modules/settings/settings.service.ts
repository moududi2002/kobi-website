//apps/api/src/modules/settings/settings.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  SiteSettings,
  SiteSettingsDocument,
  SITE_SETTINGS_SINGLETON_ID,
} from '../../schemas';
import { UpdateSettingsDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(SiteSettings.name)
    private readonly settingsModel: Model<SiteSettingsDocument>,
  ) {}

  async get(): Promise<SiteSettingsDocument> {
    const doc = await this.settingsModel.findOneAndUpdate(
      { singletonKey: SITE_SETTINGS_SINGLETON_ID },
      {
        $setOnInsert: {
          singletonKey: SITE_SETTINGS_SINGLETON_ID,
          siteName: 'কবির নাম',
          siteDescription: '',
          socialLinks: [],
          metaKeywords: [],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    return doc!;
  }

  async getPublic() {
    const doc = await this.get();
    return {
      siteName: doc.siteName,
      siteDescription: doc.siteDescription,
      logo: doc.logo ?? null,
      favicon: doc.favicon ?? null,
      contactEmail: doc.contactEmail ?? '',
      contactPhone: doc.contactPhone ?? '',
      socialLinks: doc.socialLinks,
      metaKeywords: doc.metaKeywords,
      updatedAt: doc.updatedAt,
    };
  }

  async update(dto: UpdateSettingsDto): Promise<SiteSettingsDocument> {
    const set: Record<string, any> = {};
    for (const [k, v] of Object.entries(dto)) {
      if (v !== undefined) set[k] = v;
    }

    const doc = await this.settingsModel.findOneAndUpdate(
      { singletonKey: SITE_SETTINGS_SINGLETON_ID },
      {
        $set: set,
        $setOnInsert: { singletonKey: SITE_SETTINGS_SINGLETON_ID },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return doc!;
  }
}