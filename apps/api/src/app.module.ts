// apps/api/src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

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

import { AppLogger } from './common/logger/app-logger.service';

import { ContactModule } from './modules/contact/contact.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),

    // Throttler: 100 requests / minute globally
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 100,
      },
    ]),

    DatabaseModule,

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
    ContactModule,

  ],
  providers: [
    AppLogger,
    // Throttler guard first so it applies even on public routes
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}