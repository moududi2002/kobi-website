//apps/api/src/modules/contact/contact.admin.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

import { ContactService } from './contact.service';
import {
  ContactMessageQueryDto,
  UpdateContactMessageStatusDto,
} from './dto/contact.dto';
import { Roles, Role } from '../../common/decorators/roles.decorator';

@ApiTags('Contact (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/contact')
export class ContactAdminController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  @ApiOperation({ summary: 'সব message (paginated)' })
  async list(@Query() query: ContactMessageQueryDto) {
    return this.contactService.findAll(query);
  }

  @Get('count-new')
  @ApiOperation({ summary: 'নতুন message সংখ্যা' })
  async countNew() {
    const count = await this.contactService.countNew();
    return { count };
  }

  @Get(':id')
  @ApiOperation({ summary: 'একটি message' })
  async getOne(@Param('id') id: string) {
    return this.contactService.findByIdOrFail(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Status update' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactMessageStatusDto,
  ) {
    return this.contactService.updateStatus(id, dto.status, dto.adminNote);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Message delete' })
  async remove(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}