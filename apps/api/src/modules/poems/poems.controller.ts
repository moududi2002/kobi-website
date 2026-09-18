// apps/api/src/modules/poems/poems.controller.ts
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { PoemsService } from './poems.service';
import { PoemQueryDto } from './dto/poem.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Poems (public)')
@Controller('poems')
export class PoemsController {
  constructor(private readonly poemsService: PoemsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'কবিতা তালিকা (paginated)' })
  async list(@Query() query: PoemQueryDto) {
    return this.poemsService.findAllPublic(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'নির্বাচিত কবিতা' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async featured(@Query('limit') limit?: string) {
    const n = limit ? Math.min(Math.max(parseInt(limit, 10) || 5, 1), 20) : 5;
    return this.poemsService.findFeaturedPublic(n);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'একটি কবিতা (slug)' })
  async getOne(@Param('slug') slug: string) {
    return this.poemsService.findBySlugPublic(slug);
  }

  @Public()
  @Post(':slug/view')
  @ApiOperation({ summary: 'View count বৃদ্ধি' })
  async view(@Param('slug') slug: string) {
    return this.poemsService.incrementViewBySlug(slug);
  }
}