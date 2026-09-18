// apps/api/src/modules/lyrics/lyrics.admin.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { LyricsService } from './lyrics.service';
import {
  CreateLyricDto,
  UpdateLyricDto,
  LyricQueryDto,
  UpdateLyricStatusDto,
  UpdateLyricFeaturedDto,
} from './dto/lyric.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('Lyrics (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/lyrics')
export class LyricsAdminController {
  constructor(private readonly lyricsService: LyricsService) {}

  @Get()
  @ApiOperation({ summary: 'সব লিরিক (admin)' })
  async list(@Query() query: LyricQueryDto) {
    return this.lyricsService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'একটি লিরিক (id)' })
  async getOne(@Param('id') id: string) {
    return this.lyricsService.findByIdOrFail(id);
  }

  @Post()
  @ApiOperation({ summary: 'নতুন লিরিক' })
  async create(@Body() dto: CreateLyricDto) {
    return this.lyricsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'লিরিক update' })
  async update(@Param('id') id: string, @Body() dto: UpdateLyricDto) {
    return this.lyricsService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'লিরিকের status পরিবর্তন' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateLyricStatusDto,
  ) {
    return this.lyricsService.updateStatus(id, dto.status);
  }

  @Patch(':id/featured')
  @ApiOperation({ summary: 'Featured toggle' })
  async updateFeatured(
    @Param('id') id: string,
    @Body() dto: UpdateLyricFeaturedDto,
  ) {
    return this.lyricsService.updateFeatured(id, dto.featured);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'লিরিক archive (soft delete)' })
  async softDelete(@Param('id') id: string) {
    return this.lyricsService.softDelete(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'লিরিক permanently delete' })
  async hardDelete(@Param('id') id: string) {
    return this.lyricsService.hardDelete(id);
  }
}