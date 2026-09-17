// apps/api/src/scripts/seed.ts
import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { AppModule } from '../app.module';
import {
  User,
  UserDocument,
  Category,
  CategoryDocument,
  About,
  AboutDocument,
  Homepage,
  HomepageDocument,
  SiteSettings,
  SiteSettingsDocument,
  ABOUT_SINGLETON_ID,
  HOMEPAGE_SINGLETON_ID,
  SITE_SETTINGS_SINGLETON_ID,
} from '../schemas';

const SYSTEM_CATEGORIES = [
  {
    name: 'হামদ',
    nameEn: 'Hamd',
    slug: 'hamd',
    type: 'lyric' as const,
    order: 1,
    isSystem: true,
    description: 'আল্লাহর প্রশংসামূলক গান',
  },
  {
    name: 'নাতে রাসুল',
    nameEn: 'Nate Rasul',
    slug: 'nate-rasul',
    type: 'lyric' as const,
    order: 2,
    isSystem: true,
    description: 'মহানবী (সা.)-এর শানমূলক গান',
  },
  {
    name: 'মায়ের গান',
    nameEn: 'Mayer Gan',
    slug: 'mayer-gan',
    type: 'lyric' as const,
    order: 3,
    isSystem: true,
    description: 'মায়ের স্নেহ ও ভালোবাসার গান',
  },
  {
    name: 'দেশাত্মবোধক',
    nameEn: 'Patriotic',
    slug: 'deshatmobodhok',
    type: 'lyric' as const,
    order: 4,
    isSystem: true,
    description: 'দেশপ্রেমের গান',
  },
  {
    name: 'রম্য',
    nameEn: 'Humorous',
    slug: 'rommo',
    type: 'lyric' as const,
    order: 5,
    isSystem: true,
    description: 'হাস্যরসাত্মক গান',
  },
];

async function bootstrap() {
  const logger = new Logger('Seed');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const config = app.get(ConfigService);

    const UserModel = app.get<Model<UserDocument>>(getModelToken(User.name));
    const CategoryModel = app.get<Model<CategoryDocument>>(
      getModelToken(Category.name),
    );
    const AboutModel = app.get<Model<AboutDocument>>(
      getModelToken(About.name),
    );
    const HomepageModel = app.get<Model<HomepageDocument>>(
      getModelToken(Homepage.name),
    );
    const SettingsModel = app.get<Model<SiteSettingsDocument>>(
      getModelToken(SiteSettings.name),
    );

    // ---- 1. Admin User ----
    const adminEmail = config.get<string>('admin.email')!;
    const adminPassword = config.get<string>('admin.password')!;
    const adminName = config.get<string>('admin.name')!;

    const existingAdmin = await UserModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      logger.log(`ℹ️  Admin user already exists: ${adminEmail}`);
    } else {
      const hashed = await bcrypt.hash(adminPassword, 12);
      await UserModel.create({
        email: adminEmail,
        password: hashed,
        name: adminName,
        role: 'admin',
        isActive: true,
      });
      logger.log(`✅ Admin user created: ${adminEmail}`);
    }

    // ---- 2. System Categories ----
    for (const cat of SYSTEM_CATEGORIES) {
      const existing = await CategoryModel.findOne({ slug: cat.slug });
      if (existing) {
        logger.log(`ℹ️  Category exists: ${cat.name}`);
        continue;
      }
      await CategoryModel.create(cat);
      logger.log(`✅ Category created: ${cat.name}`);
    }

    // ---- 3. Singleton Documents ----
    // About
    const existingAbout = await AboutModel.findOne({
      singletonKey: ABOUT_SINGLETON_ID,
    });
    if (!existingAbout) {
      await AboutModel.create({
        singletonKey: ABOUT_SINGLETON_ID,
        shortBio: '',
        fullBio: '',
        achievements: [],
        timeline: [],
        socialLinks: [],
      });
      logger.log('✅ About singleton created');
    } else {
      logger.log('ℹ️  About singleton exists');
    }

    // Homepage
    const existingHomepage = await HomepageModel.findOne({
      singletonKey: HOMEPAGE_SINGLETON_ID,
    });
    if (!existingHomepage) {
      await HomepageModel.create({
        singletonKey: HOMEPAGE_SINGLETON_ID,
        heroSlides: [],
      });
      logger.log('✅ Homepage singleton created');
    } else {
      logger.log('ℹ️  Homepage singleton exists');
    }

    // Site Settings
    const existingSettings = await SettingsModel.findOne({
      singletonKey: SITE_SETTINGS_SINGLETON_ID,
    });
    if (!existingSettings) {
      await SettingsModel.create({
        singletonKey: SITE_SETTINGS_SINGLETON_ID,
        siteName: 'কবির নাম',
        siteDescription: '',
        socialLinks: [],
        metaKeywords: [],
      });
      logger.log('✅ Site Settings singleton created');
    } else {
      logger.log('ℹ️  Site Settings singleton exists');
    }

    logger.log('🎉 Seeding completed successfully');
  } catch (err) {
    logger.error('❌ Seeding failed', err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();