//apps/api/src/modules/homepage/homepage.admin.controller.ts
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { HomepageService } from './homepage.service';
import { UpdateHomepageDto } from './dto/homepage.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('Homepage (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/homepage')
export class HomepageAdminController {
  constructor(private readonly homepageService: HomepageService) {}

  @Get()
  @ApiOperation({ summary: 'Homepage (admin — full)' })
  async get() {
    return this.homepageService.get();
  }

  @Patch()
  @ApiOperation({ summary: 'Homepage update' })
  async update(@Body() dto: UpdateHomepageDto) {
    return this.homepageService.update(dto);
  }
}