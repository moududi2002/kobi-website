// apps/api/src/modules/categories/categories.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories (public)')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'সব category তালিকা' })
  @ApiQuery({ name: 'type', required: false, enum: ['poem', 'lyric'] })
  async list(@Query('type') type?: 'poem' | 'lyric') {
    return this.categoriesService.findAllPublic(type);
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'একটি category' })
  async getOne(@Param('slug') slug: string) {
    return this.categoriesService.findBySlugPublic(slug);
  }
}