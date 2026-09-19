// apps/api/src/modules/media/media.admin.controller.ts
import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { MediaService } from './media.service';
import { Roles, Role } from '../../common/decorators/roles.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';

import { Throttle } from '@nestjs/throttler';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

function fileFilter(
  _req: any,
  file: Express.Multer.File,
  cb: (err: Error | null, accept: boolean) => void,
) {
  if (!ALLOWED_MIME.includes(file.mimetype)) {
    return cb(
      new BadRequestException(
        `অনুমোদিত ফাইল টাইপ: ${ALLOWED_MIME.join(', ')}`,
      ),
      false,
    );
  }
  cb(null, true);
}

@ApiTags('Media (admin)')
@ApiBearerAuth('access-token')
@Roles(Role.ADMIN)
@Controller('admin/media')
export class MediaAdminController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'মিডিয়া তালিকা' })
  async list(@Query() query: PaginationDto) {
    return this.mediaService.list(query);
  }

  @Post('upload')
  @Throttle({ default: { limit: 20, ttl: 60_000 } }) // 20 upload / min
  @ApiOperation({ summary: 'একটি ছবি আপলোড' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string' },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter,
    }),
  )
  async uploadOne(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
    @Query('folder') folder?: string,
  ) {
    if (!file) throw new BadRequestException('ফাইল দেওয়া হয়নি');
    return this.mediaService.uploadBuffer(
      file.buffer,
      user.userId,
      folder,
      file.originalname,
    );
  }

  @Post('upload-many')
  @Throttle({ default: { limit: 5, ttl: 60_000 } }) // 5 bulk uploads / min
  @ApiOperation({ summary: 'একাধিক ছবি আপলোড (max 20)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
      required: ['files'],
    },
  })
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      limits: { fileSize: MAX_FILE_SIZE },
      fileFilter,
    }),
  )
  async uploadMany(
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: AuthUser,
    @Query('folder') folder?: string,
  ) {
    if (!files?.length) throw new BadRequestException('কোনো ফাইল নেই');
    return this.mediaService.uploadMany(
      files.map((f) => f.buffer),
      user.userId,
      folder,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'মিডিয়া delete (Cloudinary + DB)' })
  async remove(@Param('id') id: string) {
    return this.mediaService.deleteById(id);
  }

  @Delete('folder/:folder')
  @ApiOperation({ summary: 'একটি folder-এর সব মিডিয়া delete' })
  async removeFolder(@Param('folder') folder: string) {
    return this.mediaService.deleteFolder(folder);
  }

  
}
