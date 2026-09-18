import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dto/settings.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('Settings (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/settings')
export class SettingsAdminController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Settings (admin — full)' })
  async get() {
    return this.settingsService.get();
  }

  @Patch()
  @ApiOperation({ summary: 'Settings update' })
  async update(@Body() dto: UpdateSettingsDto) {
    return this.settingsService.update(dto);
  }
}