//apps/api/src/modules/seo/seo.module.ts
import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoController } from './seo.controller';

@Module({
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}