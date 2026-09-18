// apps/api/src/modules/preview/preview.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { nanoid } from 'nanoid';

import { PreviewToken, PreviewTokenDocument } from '../../schemas';
import { parseDurationMs } from '../../common/utils/token.util';

export type PreviewContentType = 'poem' | 'lyric' | 'about' | 'homepage';

@Injectable()
export class PreviewService {
  constructor(
    @InjectModel(PreviewToken.name)
    private readonly previewModel: Model<PreviewTokenDocument>,
    private readonly config: ConfigService,
  ) {}

  async createToken(
    contentType: PreviewContentType,
    contentId: string,
    userId: string,
  ): Promise<{ token: string; expiresAt: Date }> {
    const expiresIn = this.config.get<string>('preview.expiresIn')!;
    const expiresAt = new Date(Date.now() + parseDurationMs(expiresIn));

    const token = nanoid(32);

    await this.previewModel.create({
      token,
      contentType,
      contentId: new Types.ObjectId(contentId),
      expiresAt,
      createdBy: new Types.ObjectId(userId),
    });

    return { token, expiresAt };
  }

  async consumeToken(token: string): Promise<PreviewTokenDocument> {
    const record = await this.previewModel.findOne({ token });
    if (!record) throw new NotFoundException('Preview token অবৈধ');
    if (record.expiresAt.getTime() < Date.now()) {
      throw new NotFoundException('Preview token মেয়াদোত্তীর্ণ');
    }
    return record;
  }
}