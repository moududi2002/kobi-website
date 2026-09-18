// apps/api/src/modules/poems/poems.module.ts
import { Module } from '@nestjs/common';
import { PoemsService } from './poems.service';
import { PoemsController } from './poems.controller';
import { PoemsAdminController } from './poems.admin.controller';
import { PreviewModule } from '../preview/preview.module';

@Module({
  imports: [PreviewModule],
  controllers: [PoemsController, PoemsAdminController],
  providers: [PoemsService],
  exports: [PoemsService],
})
export class PoemsModule {}