//apps/api/src/modules/media/media.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

import { MediaService } from './media.service';
import { MediaAdminController } from './media.admin.controller';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  imports: [
    MulterModule.register({
      dest: undefined, // use memory storage (buffer), stream directly to Cloudinary
    }),
  ],
  controllers: [MediaAdminController],
  providers: [MediaService, CloudinaryProvider],
  exports: [MediaService, CloudinaryProvider],
})
export class MediaModule {}