// apps/api/src/modules/about/about.module.ts
import { Module } from '@nestjs/common';

import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { AboutAdminController } from './about.admin.controller';

@Module({
  controllers: [AboutController, AboutAdminController],
  providers: [AboutService],
  exports: [AboutService],
})
export class AboutModule {}