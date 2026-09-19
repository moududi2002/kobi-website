//apps/api/src/modules/search/search.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search.dto';
import { Public } from '../../common/decorators/public.decorator';

import { Throttle } from '@nestjs/throttler';


@ApiTags('Search (public)')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'গ্লোবাল সার্চ (কবিতা + লিরিক)' })
  async search(@Query() query: SearchQueryDto) {
    return this.searchService.search(query);
  }
}