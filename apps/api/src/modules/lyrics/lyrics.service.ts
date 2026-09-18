// apps/api/src/modules/lyrics/lyrics.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';

import { Lyric, LyricDocument, Category, CategoryDocument } from '../../schemas';
import {
  CreateLyricDto,
  UpdateLyricDto,
  LyricQueryDto,
} from './dto/lyric.dto';
import {
  prepareContentFields,
  computePublishedAt,
} from '../../common/utils/content.util';
import { extractYouTubeId } from '../../common/utils/html.util';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class LyricsService {
  constructor(
    @InjectModel(Lyric.name)
    private readonly lyricModel: Model<LyricDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  // ----------------- PUBLIC -----------------

  async findAllPublic(query: LyricQueryDto): Promise<PaginatedResult<any>> {
    const filter: FilterQuery<LyricDocument> = { status: 'published' };
    await this.applyCommonFilters(filter, query);

    const sort = this.resolveSort(query.sort);
    return this.paginate(filter, query, sort);
  }

  async findFeaturedPublic(limit = 5) {
    return this.lyricModel
      .find({ status: 'published', featured: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .populate('category', 'name nameEn slug type')
      .lean();
  }

  async findBySlugPublic(slug: string) {
    const lyric = await this.lyricModel
      .findOne({ slug, status: 'published' })
      .populate('category', 'name nameEn slug type')
      .lean();
    if (!lyric) throw new NotFoundException('লিরিক পাওয়া যায়নি');
    return lyric;
  }

  // ----------------- ADMIN -----------------

  async findAllAdmin(query: LyricQueryDto): Promise<PaginatedResult<any>> {
    const filter: FilterQuery<LyricDocument> = {};
    if (query.status) filter.status = query.status;
    await this.applyCommonFilters(filter, query);

    const sort = this.resolveSort(query.sort);
    return this.paginate(filter, query, sort);
  }

  async findByIdOrFail(id: string): Promise<LyricDocument> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('অবৈধ ID');
    const lyric = await this.lyricModel
      .findById(id)
      .populate('category', 'name nameEn slug type');
    if (!lyric) throw new NotFoundException('লিরিক পাওয়া যায়নি');
    return lyric;
  }

  async create(dto: CreateLyricDto): Promise<LyricDocument> {
    // validate category exists and type = 'lyric'
    const cat = await this.categoryModel.findById(dto.category);
    if (!cat) throw new BadRequestException('Category পাওয়া যায়নি');
    if (cat.type !== 'lyric') {
      throw new BadRequestException(
        'এই category lyric type নয়',
      );
    }

    const status = dto.status ?? 'draft';
    const { slug, contentPlain } = await prepareContentFields(
      this.lyricModel,
      dto.title,
      dto.content,
      dto.slug,
      undefined,
      false,
    );

    const youtubeVideoId = dto.youtubeUrl
      ? extractYouTubeId(dto.youtubeUrl)
      : null;

    try {
      const lyric = new this.lyricModel({
        title: dto.title,
        slug,
        excerpt: dto.excerpt || '',
        content: dto.content,
        contentPlain,
        youtubeUrl: dto.youtubeUrl || null,
        youtubeVideoId,
        category: new Types.ObjectId(dto.category),
        tags: dto.tags || [],
        status,
        publishedAt: computePublishedAt(status, null),
        featured: dto.featured ?? false,
        seoTitle: dto.seoTitle || '',
        seoDescription: dto.seoDescription || '',
      });
      return await lyric.save();
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('এই slug আগে থেকেই আছে');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateLyricDto): Promise<LyricDocument> {
    const lyric = await this.findByIdOrFail(id);

    const titleChanged = dto.title !== undefined && dto.title !== lyric.title;
    const contentChanged =
      dto.content !== undefined && dto.content !== lyric.content;
    const slugProvided = dto.slug !== undefined;

    if (titleChanged || contentChanged || slugProvided) {
      const newTitle = dto.title ?? lyric.title;
      const newContent = dto.content ?? lyric.content;
      const { slug, contentPlain } = await prepareContentFields(
        this.lyricModel,
        newTitle,
        newContent,
        dto.slug,
        lyric._id.toString(),
        false,
      );
      lyric.slug = slug;
      lyric.contentPlain = contentPlain;
    }

    if (dto.title !== undefined) lyric.title = dto.title;
    if (dto.content !== undefined) lyric.content = dto.content;
    if (dto.excerpt !== undefined) lyric.excerpt = dto.excerpt;
    if (dto.tags !== undefined) lyric.tags = dto.tags;
    if (dto.seoTitle !== undefined) lyric.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined)
      lyric.seoDescription = dto.seoDescription;
    if (dto.featured !== undefined) lyric.featured = dto.featured;

    if (dto.youtubeUrl !== undefined) {
      lyric.youtubeUrl = dto.youtubeUrl || null;
      lyric.youtubeVideoId = dto.youtubeUrl
        ? extractYouTubeId(dto.youtubeUrl)
        : null;
    }

    if (dto.category !== undefined) {
      const cat = await this.categoryModel.findById(dto.category);
      if (!cat) throw new BadRequestException('Category পাওয়া যায়নি');
      if (cat.type !== 'lyric') {
        throw new BadRequestException('এই category lyric type নয়');
      }
      lyric.category = new Types.ObjectId(dto.category);
    }

    if (dto.status !== undefined && dto.status !== lyric.status) {
      lyric.publishedAt = computePublishedAt(
        dto.status,
        lyric.publishedAt ?? null,
      );
      lyric.status = dto.status;
    }

    return lyric.save();
  }

  async updateStatus(
    id: string,
    status: 'draft' | 'published' | 'archived',
  ): Promise<LyricDocument> {
    const lyric = await this.findByIdOrFail(id);
    if (lyric.status !== status) {
      lyric.publishedAt = computePublishedAt(status, lyric.publishedAt ?? null);
      lyric.status = status;
    }
    return lyric.save();
  }

  async updateFeatured(id: string, featured: boolean): Promise<LyricDocument> {
    const lyric = await this.findByIdOrFail(id);
    lyric.featured = featured;
    return lyric.save();
  }

  async softDelete(id: string): Promise<{ success: true }> {
    const lyric = await this.findByIdOrFail(id);
    lyric.status = 'archived';
    lyric.publishedAt = null;
    await lyric.save();
    return { success: true };
  }

  async hardDelete(id: string): Promise<{ success: true }> {
    const lyric = await this.findByIdOrFail(id);
    await this.lyricModel.deleteOne({ _id: lyric._id }).exec();
    return { success: true };
  }

  async incrementViewBySlug(slug: string): Promise<{ success: true }> {
    await this.lyricModel
      .updateOne(
        { slug, status: 'published' },
        { $inc: { viewCount: 1 } },
      )
      .exec();
    return { success: true };
  }

  // ----------------- helpers -----------------

  private async applyCommonFilters(
    filter: FilterQuery<LyricDocument>,
    query: LyricQueryDto,
  ) {
    if (query.category) {
      if (Types.ObjectId.isValid(query.category)) {
        filter.category = new Types.ObjectId(query.category);
      } else {
        // treat as slug
        const cat = await this.categoryModel.findOne({ slug: query.category });
        if (cat) filter.category = cat._id;
        else filter.category = new Types.ObjectId(); // no match
      }
    }
    if (query.tag) filter.tags = query.tag;
    if (query.featured === 'true') filter.featured = true;
    if (query.search) filter.$text = { $search: query.search };
  }

  private resolveSort(
    sort?: 'latest' | 'oldest' | 'popular',
  ): Record<string, 1 | -1> {
    switch (sort) {
      case 'oldest':
        return { publishedAt: 1, createdAt: 1 };
      case 'popular':
        return { viewCount: -1, publishedAt: -1 };
      default:
        return { publishedAt: -1, createdAt: -1 };
    }
  }

  private async paginate(
    filter: FilterQuery<LyricDocument>,
    query: LyricQueryDto,
    sort: Record<string, 1 | -1>,
  ): Promise<PaginatedResult<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      this.lyricModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('category', 'name nameEn slug type')
        .lean()
        .exec(),
      this.lyricModel.countDocuments(filter).exec(),
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
}