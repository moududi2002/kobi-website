//apps/api/src/modules/seo/seo.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { SeoService } from './seo.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('SEO (public)')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Public()
  @Get('sitemap-data')
  @ApiOperation({ summary: 'Sitemap ডেটা (frontend XML build-এর জন্য)' })
  async sitemap() {
    return this.seoService.getSitemapEntries();
  }

  @Public()
  @Get('rss-data')
  @ApiOperation({ summary: 'RSS feed items (frontend XML build-এর জন্য)' })
  async rss() {
  return this.seoService.getRssItems(20);
  }
}