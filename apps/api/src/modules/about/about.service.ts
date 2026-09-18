//apps/api/src/modules/about/about.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { About, AboutDocument, ABOUT_SINGLETON_ID } from '../../schemas';
import { UpdateAboutDto } from './dto/about.dto';
import { stripHtml } from '../../common/utils/html.util';

@Injectable()
export class AboutService {
  private readonly logger = new Logger(AboutService.name);

  constructor(
    @InjectModel(About.name)
    private readonly aboutModel: Model<AboutDocument>,
  ) {}

  /**
   * Get the singleton About document.
   * Creates one with defaults if it doesn't exist yet (upsert).
   */
  async get(): Promise<AboutDocument> {
    const doc = await this.aboutModel.findOneAndUpdate(
      { singletonKey: ABOUT_SINGLETON_ID },
      {
        $setOnInsert: {
          singletonKey: ABOUT_SINGLETON_ID,
          shortBio: '',
          fullBio: '',
          achievements: [],
          timeline: [],
          socialLinks: [],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    return doc!;
  }

  /**
   * Public response — hides internal fields, adds computed values.
   */
  async getPublic() {
    const doc = await this.get();
    return {
      shortBio: doc.shortBio,
      fullBio: doc.fullBio,
      fullBioPlain: stripHtml(doc.fullBio),
      portraitImage: doc.portraitImage ?? null,
      literaryIdentity: doc.literaryIdentity ?? '',
      achievements: doc.achievements,
      timeline: doc.timeline,
      contactEmail: doc.contactEmail ?? '',
      contactPhone: doc.contactPhone ?? '',
      socialLinks: doc.socialLinks,
      updatedAt: doc.updatedAt,
    };
  }

  async update(dto: UpdateAboutDto): Promise<AboutDocument> {
    const set: Record<string, any> = {};
    for (const [k, v] of Object.entries(dto)) {
      if (v !== undefined) set[k] = v;
    }

    const doc = await this.aboutModel.findOneAndUpdate(
      { singletonKey: ABOUT_SINGLETON_ID },
      {
        $set: set,
        $setOnInsert: { singletonKey: ABOUT_SINGLETON_ID },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return doc!;
  }
}