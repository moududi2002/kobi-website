// apps/api/src/modules/lyrics/lyrics.module.ts

import { Module } from '@nestjs/common';

import { LyricsService } from './lyrics.service';
import { LyricsController } from './lyrics.controller';
import { LyricsAdminController } from './lyrics.admin.controller';
import { PreviewModule } from '../preview/preview.module';


@Module({ 
    imports: [PreviewModule],
    controllers: [LyricsController, LyricsAdminController],
    providers: [LyricsService],
    exports: [LyricsService],
})
export class LyricsModule {}