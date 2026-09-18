// apps/api/src/modules/settings/settings.module.ts
import { Module } from '@nestjs/common';

import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { SettingsAdminController } from './settings.admin.controller';

@Module({
  controllers: [SettingsController, SettingsAdminController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}