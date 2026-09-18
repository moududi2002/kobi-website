// apps/api/src/modules/homepage/homepage.module.ts
import { Module } from '@nestjs/common';

import { HomepageService } from './homepage.service';
import { HomepageController } from './homepage.controller';
import { HomepageAdminController } from './homepage.admin.controller';

@Module({
  controllers: [HomepageController, HomepageAdminController],
  providers: [HomepageService],
  exports: [HomepageService],
})
export class HomepageModule {}