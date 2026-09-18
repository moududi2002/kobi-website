// apps/api/src/modules/preview/preview.module.ts

import { Module } from '@nestjs/common';

import { PreviewService } from './preview.service';
import { PreviewController } from './preview.controller';

@Module({
  controllers: [PreviewController],
  providers: [PreviewService],
  exports: [PreviewService],
})
export class PreviewModule {}