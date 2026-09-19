// apps/api/src/database/models.module.ts
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
export * from '../schemas/contact-message.schema';

import {
  User,
  UserSchema,
  RefreshToken,
  RefreshTokenSchema,
  Category,
  CategorySchema,
  Poem,
  PoemSchema,
  Lyric,
  LyricSchema,
  About,
  AboutSchema,
  Homepage,
  HomepageSchema,
  SiteSettings,
  SiteSettingsSchema,
  MediaAsset,
  MediaAssetSchema,
  PreviewToken,
  PreviewTokenSchema,
  ContactMessage,
  ContactMessageSchema,
} from '../schemas';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Poem.name, schema: PoemSchema },
      { name: Lyric.name, schema: LyricSchema },
      { name: About.name, schema: AboutSchema },
      { name: Homepage.name, schema: HomepageSchema },
      { name: SiteSettings.name, schema: SiteSettingsSchema },
      { name: MediaAsset.name, schema: MediaAssetSchema },
      { name: PreviewToken.name, schema: PreviewTokenSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },

    ]),
  ],
  exports: [
    MongooseModule,
  ],
})
export class ModelsModule {}
