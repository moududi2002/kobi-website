// apps\api\src\modules\poems\poems.admin.controller.ts
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PreviewService } from '../preview/preview.service';

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
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
} from '@nestjs/swagger';

import { PoemsService } from './poems.service';
import {
  CreatePoemDto,
  UpdatePoemDto,
  PoemQueryDto,
  UpdatePoemStatusDto,
  UpdatePoemFeaturedDto,
} from './dto/poem.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('Poems (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/poems')
export class PoemsAdminController {
  constructor(
    private readonly poemsService: PoemsService,
    private readonly previewService: PreviewService,

) {}

  @Get()
  @ApiOperation({ summary: 'সব কবিতা (admin)' })
  async list(@Query() query: PoemQueryDto) {
    return this.poemsService.findAllAdmin(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'একটি কবিতা (id)' })
  async getOne(@Param('id') id: string) {
    return this.poemsService.findByIdOrFail(id);
  }

  @Post()
  @ApiOperation({ summary: 'নতুন কবিতা' })
  async create(@Body() dto: CreatePoemDto) {
    return this.poemsService.create(dto);
  }

    @Post(':id/preview-token')
    @ApiOperation({ summary: 'Draft preview token generate' })
    async createPreviewToken(
        @Param('id') id: string,
        @CurrentUser() user: AuthUser,
    ) {
  const poem = await this.poemsService.findByIdOrFail(id);
  return this.previewService.createToken('poem', poem._id.toString(), user.userId);
    }

  @Patch(':id')
  @ApiOperation({ summary: 'কবিতা update' })
  async update(@Param('id') id: string, @Body() dto: UpdatePoemDto) {
    return this.poemsService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'কবিতার status পরিবর্তন' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdatePoemStatusDto,
  ) {
    return this.poemsService.updateStatus(id, dto.status);
  }

  @Patch(':id/featured')
  @ApiOperation({ summary: 'Featured toggle' })
  async updateFeatured(
    @Param('id') id: string,
    @Body() dto: UpdatePoemFeaturedDto,
  ) {
    return this.poemsService.updateFeatured(id, dto.featured);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'কবিতা archive (soft delete)' })
  async softDelete(@Param('id') id: string) {
    return this.poemsService.softDelete(id);
  }

  @Delete(':id/hard')
  @ApiOperation({ summary: 'কবিতা permanently delete' })
  async hardDelete(@Param('id') id: string) {
    return this.poemsService.hardDelete(id);
  }
}