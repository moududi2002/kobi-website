//apps/api/src/modules/lyrics/lyrics.controller.ts
import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { LyricsService } from './lyrics.service';
import { LyricQueryDto } from './dto/lyric.dto';
import { Public } from '../../common/decorators/public.decorator';

import { Throttle } from '@nestjs/throttler';


@ApiTags('Lyrics (public)')
@Controller('lyrics')
export class LyricsController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'লিরিক তালিকা (paginated)' })
  async list(@Query() query: LyricQueryDto) {
    return this.lyricsService.findAllPublic(query);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'নির্বাচিত লিরিক' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async featured(@Query('limit') limit?: string) {
    const n = limit ? Math.min(Math.max(parseInt(limit, 10) || 5, 1), 20) : 5;
    return this.lyricsService.findFeaturedPublic(n);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'একটি লিরিক (slug)' })
  async getOne(@Param('slug') slug: string) {
    return this.lyricsService.findBySlugPublic(slug);
  }

  @Public()
  @Post(':slug/view')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })   // 10 view hits / min per IP
  @ApiOperation({ summary: 'View count বৃদ্ধি' })
  async view(@Param('slug') slug: string) {
    return this.lyricsService.incrementViewBySlug(slug);
  }
}