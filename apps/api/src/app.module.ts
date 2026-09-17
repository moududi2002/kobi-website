// apps/api/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import configuration from './config/configuration';
import { envValidationSchema } from './config/validation';

import { DatabaseModule } from './database/database.module';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PoemsModule } from './modules/poems/poems.module';
import { LyricsModule } from './modules/lyrics/lyrics.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { AboutModule } from './modules/about/about.module';
import { HomepageModule } from './modules/homepage/homepage.module';
import { MediaModule } from './modules/media/media.module';
import { PreviewModule } from './modules/preview/preview.module';
import { SettingsModule } from './modules/settings/settings.module';
import { HealthModule } from './modules/health/health.module';

import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
  imports: [
    // Config (must be first)
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: {
        abortEarly: false,
      },
    }),

    // Database
    DatabaseModule,

    // Feature modules
    AuthModule,
    UsersModule,
    PoemsModule,
    LyricsModule,
    CategoriesModule,
    AboutModule,
    HomepageModule,
    MediaModule,
    PreviewModule,
    SettingsModule,
    HealthModule,
  ],
  providers: [
    // Global JWT guard — must explicitly mark routes as @Public()
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Global roles guard
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}