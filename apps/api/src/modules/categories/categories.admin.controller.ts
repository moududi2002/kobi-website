// apps\api\src\modules\categories\categories.admin.controller.ts
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
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('Categories (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/categories')
export class CategoriesAdminController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'সব category (admin)' })
  @ApiQuery({ name: 'type', required: false, enum: ['poem', 'lyric'] })
  async list(@Query('type') type?: 'poem' | 'lyric') {
    return this.categoriesService.findAllAdmin(type);
  }

  @Post()
  @ApiOperation({ summary: 'নতুন category' })
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Category update' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoriesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Category delete (system ছাড়া)' })
  async remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}