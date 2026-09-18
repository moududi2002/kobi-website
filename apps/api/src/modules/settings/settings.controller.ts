// apps/api/src/modules/settings/settings.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { SettingsService } from './settings.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Settings (public)')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'সাইট সেটিংস (public subset)' })
  async get() {
    return this.settingsService.getPublic();
  }
}
