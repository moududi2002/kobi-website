//apps/api/src/modules/contact/contact.controller.ts
import { Body, Controller, HttpCode, HttpStatus, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Request } from 'express';

import { ContactService } from './contact.service';
import { CreateContactMessageDto } from './dto/contact.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Contact (public)')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60 * 60_000 } }) // 5/hour per IP
  @ApiOperation({ summary: 'Contact message পাঠান' })
  @ApiResponse({ status: 200, description: 'সফলভাবে পাঠানো হয়েছে' })
  async send(@Body() dto: CreateContactMessageDto, @Req() req: Request) {
    return this.contactService.create(dto, {
      ipAddress: req.ip,
      userAgent: req.get('user-agent') || undefined,
    });
  }
}