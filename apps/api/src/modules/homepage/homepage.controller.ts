//apps/api/src/modules/homepage/homepage.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { HomepageService } from './homepage.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Homepage (public)')
@Controller('homepage')
export class HomepageController {
  constructor(private readonly homepageService: HomepageService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'হোমপেজ কনটেন্ট (public)' })
  async get() {
    return this.homepageService.getPublic();
  }
  @Public()
  @Get('full')
  @ApiOperation({ summary: 'হোমপেজ পূর্ণ aggregate (এক request-এ সব)' })
  async getFull() {
        return this.homepageService.getFull();
    }
}