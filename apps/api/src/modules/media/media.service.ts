//apps/api/src/modules/media/media.service.ts
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { v2 as Cloudinary } from 'cloudinary';
import { Readable } from 'stream';

import { CLOUDINARY } from './providers/cloudinary.provider';
import { MediaAsset, MediaAssetDocument } from '../../schemas';
import { PaginationDto } from '../../common/dto/pagination.dto';

export interface UploadResult {
  _id: string;
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  folder: string;
}

export interface CloudinaryUploadResponse {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  resource_type: string;
}

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly defaultFolder = 'kobi-website';

  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof Cloudinary,
    @InjectModel(MediaAsset.name)
    private readonly mediaModel: Model<MediaAssetDocument>,
  ) {}

  /**
   * Upload a single buffer to Cloudinary and record it in DB.
   */
  async uploadBuffer(
    buffer: Buffer,
    userId: string,
    folder?: string,
    filename?: string,
  ): Promise<UploadResult> {
    if (!buffer || buffer.length === 0) {
      throw new BadRequestException('ফাইল খালি');
    }

    const targetFolder = folder || this.defaultFolder;

    const result = await this.cloudinaryUpload(buffer, targetFolder, filename);

    const asset = await this.mediaModel.create({
      publicId: result.public_id,
      url: result.url,
      secureUrl: result.secure_url,
      format: result.format,
      width: result.width ?? null,
      height: result.height ?? null,
      bytes: result.bytes,
      folder: targetFolder,
      uploadedBy: new Types.ObjectId(userId),
    });

    return this.toUploadResult(asset);
  }

  /**
   * Upload multiple files in parallel.
   */
  async uploadMany(
    files: Buffer[],
    userId: string,
    folder?: string,
  ): Promise<UploadResult[]> {
    if (!files?.length) throw new BadRequestException('কোনো ফাইল নেই');
    if (files.length > 20) {
      throw new BadRequestException('একবারে সর্বোচ্চ ২০টি ফাইল');
    }
    return Promise.all(files.map((buf) => this.uploadBuffer(buf, userId, folder)));
  }

  /**
   * List media assets (paginated).
   */
  async list(query: PaginationDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (query.search) {
      filter.publicId = { $regex: query.search, $options: 'i' };
    }

    const [items, total] = await Promise.all([
      this.mediaModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.mediaModel.countDocuments(filter).exec(),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Delete a media asset by id — removes from Cloudinary + DB.
   */
  async deleteById(id: string): Promise<{ success: true }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('অবৈধ ID');
    }
    const asset = await this.mediaModel.findById(id);
    if (!asset) throw new NotFoundException('Media পাওয়া যায়নি');

    try {
      await this.cloudinary.uploader.destroy(asset.publicId, {
        resource_type: 'image',
        invalidate: true,
      });
    } catch (err: any) {
      this.logger.warn(
        `Cloudinary destroy failed for ${asset.publicId}: ${err.message}`,
      );
    }

    await this.mediaModel.deleteOne({ _id: asset._id }).exec();
    return { success: true };
  }

  /**
   * Delete all assets in a folder (mostly for cleanup).
   */
  async deleteFolder(folder: string): Promise<{ deleted: number }> {
    if (!folder || folder === this.defaultFolder) {
      throw new BadRequestException('এই folder delete করা যাবে না');
    }

    const assets = await this.mediaModel.find({ folder });
    let deleted = 0;
    for (const a of assets) {
      try {
        await this.cloudinary.uploader.destroy(a.publicId, {
          resource_type: 'image',
          invalidate: true,
        });
        await this.mediaModel.deleteOne({ _id: a._id });
        deleted++;
      } catch (err: any) {
        this.logger.warn(`Failed to delete ${a.publicId}: ${err.message}`);
      }
    }
    return { deleted };
  }

  // ---------------- helpers ----------------

  private cloudinaryUpload(
    buffer: Buffer,
    folder: string,
    filename?: string,
  ): Promise<CloudinaryUploadResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'image',
          use_filename: !!filename,
          filename_override: filename,
          unique_filename: true,
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result) return reject(new Error('Cloudinary returned no result'));
          resolve(result as unknown as CloudinaryUploadResponse);
        },
      );

      Readable.from(buffer).pipe(uploadStream);
    });
  }

  private toUploadResult(asset: MediaAssetDocument): UploadResult {
    return {
      _id: asset._id.toString(),
      publicId: asset.publicId,
      url: asset.url,
      secureUrl: asset.secureUrl,
      format: asset.format,
      width: asset.width ?? undefined,
      height: asset.height ?? undefined,
      bytes: asset.bytes,
      folder: asset.folder,
    };
  }
}