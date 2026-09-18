// apps/api/src/modules/preview/preview.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { PreviewService } from './preview.service';
import { Public } from '../../common/decorators/public.decorator';
import { Poem, PoemDocument, Lyric, LyricDocument } from '../../schemas';

@ApiTags('Preview')
@Controller('preview')
export class PreviewController {
  constructor(
    private readonly previewService: PreviewService,
    @InjectModel(Poem.name) private readonly poemModel: Model<PoemDocument>,
    @InjectModel(Lyric.name) private readonly lyricModel: Model<LyricDocument>,
  ) {}

  @Public()
  @Get(':token')
  @ApiOperation({ summary: 'Draft preview (token-based)' })
  async preview(@Param('token') token: string) {
    const record = await this.previewService.consumeToken(token);

    if (record.contentType === 'poem') {
      const poem = await this.poemModel
        .findById(record.contentId)
        .populate('category', 'name nameEn slug')
        .lean();
      if (!poem) throw new NotFoundException('Content পাওয়া যায়নি');
      return { type: 'poem', content: poem, isPreview: true };
    }

    if (record.contentType === 'lyric') {
      const lyric = await this.lyricModel
        .findById(record.contentId)
        .populate('category', 'name nameEn slug')
        .lean();
      if (!lyric) throw new NotFoundException('Content পাওয়া যায়নি');
      return { type: 'lyric', content: lyric, isPreview: true };
    }

    return { type: record.contentType, content: null, isPreview: true };
  }
}