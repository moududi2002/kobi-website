//apps/api/src/modules/about/about.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { AboutService } from './about.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('About (public)')
@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'লেখকের পরিচিতি (public)' })
  async get() {
    return this.aboutService.getPublic();
  }
}