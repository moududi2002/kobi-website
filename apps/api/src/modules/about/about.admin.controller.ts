//apps/api/src/modules/about/about.admin.controller.ts
import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { AboutService } from './about.service';
import { UpdateAboutDto } from './dto/about.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('About (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/about')
export class AboutAdminController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  @ApiOperation({ summary: 'About (admin — full)' })
  async get() {
    return this.aboutService.get();
  }

  @Patch()
  @ApiOperation({ summary: 'About update' })
  async update(@Body() dto: UpdateAboutDto) {
    return this.aboutService.update(dto);
  }
}