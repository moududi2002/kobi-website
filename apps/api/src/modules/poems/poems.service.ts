// apps/api/src/modules/poems/poems.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';

import { Poem, PoemDocument } from '../../schemas';
import {
  CreatePoemDto,
  UpdatePoemDto,
  PoemQueryDto,
} from './dto/poem.dto';
import {
  prepareContentFields,
  computePublishedAt,
} from '../../common/utils/content.util';
import {
  PaginatedResult,
} from '../../common/dto/pagination.dto';

@Injectable()
export class PoemsService {
  constructor(
    @InjectModel(Poem.name)
    private readonly poemModel: Model<PoemDocument>,
  ) {}

  // ----------------------------------
  // PUBLIC
  // ----------------------------------

  async findAllPublic(
    query: PoemQueryDto,
  ): Promise<PaginatedResult<any>> {
    const filter: FilterQuery<PoemDocument> = { status: 'published' };
    this.applyCommonFilters(filter, query);

    const sort = this.resolveSort(query.sort);
    return this.paginate(filter, query, sort);
  }

  async findFeaturedPublic(limit = 5) {
    return this.poemModel
      .find({ status: 'published', featured: true })
      .sort({ publishedAt: -1 })
      .limit(limit)
      .lean();
  }

  async findBySlugPublic(slug: string) {
    const poem = await this.poemModel
      .findOne({ slug, status: 'published' })
      .populate('category', 'name nameEn slug')
      .lean();
    if (!poem) throw new NotFoundException('কবিতা পাওয়া যায়নি');
    return poem;
  }

  // ----------------------------------
  // ADMIN
  // ----------------------------------

  async findAllAdmin(
    query: PoemQueryDto,
  ): Promise<PaginatedResult<any>> {
    const filter: FilterQuery<PoemDocument> = {};
    if (query.status) filter.status = query.status;
    this.applyCommonFilters(filter, query);

    const sort = this.resolveSort(query.sort);
    return this.paginate(filter, query, sort, true);
  }

  async findByIdOrFail(id: string): Promise<PoemDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('অবৈধ ID');
    }
    const poem = await this.poemModel
      .findById(id)
      .populate('category', 'name nameEn slug');
    if (!poem) throw new NotFoundException('কবিতা পাওয়া যায়নি');
    return poem;
  }

  async create(dto: CreatePoemDto): Promise<PoemDocument> {
    const status = dto.status ?? 'draft';
    const { slug, contentPlain, readingTimeMinutes } =
      await prepareContentFields(
        this.poemModel,
        dto.title,
        dto.content,
        dto.slug,
        undefined,
        true,
      );

    try {
      const poem = new this.poemModel({
        title: dto.title,
        slug,
        excerpt: dto.excerpt || '',
        content: dto.content,
        contentPlain,
        coverImage: dto.coverImage || null,
        category: dto.category ? new Types.ObjectId(dto.category) : null,
        tags: dto.tags || [],
        status,
        publishedAt: computePublishedAt(status, null),
        featured: dto.featured ?? false,
        readingTimeMinutes,
        seoTitle: dto.seoTitle || '',
        seoDescription: dto.seoDescription || '',
      });
      return await poem.save();
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('এই slug আগে থেকেই আছে');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdatePoemDto): Promise<PoemDocument> {
    const poem = await this.findByIdOrFail(id);

    // content/title changed → recompute slug + contentPlain + readingTime
    const titleChanged = dto.title !== undefined && dto.title !== poem.title;
    const contentChanged =
      dto.content !== undefined && dto.content !== poem.content;
    const slugProvided = dto.slug !== undefined;

    if (titleChanged || contentChanged || slugProvided) {
      const newTitle = dto.title ?? poem.title;
      const newContent = dto.content ?? poem.content;

      const { slug, contentPlain, readingTimeMinutes } =
        await prepareContentFields(
          this.poemModel,
          newTitle,
          newContent,
          dto.slug,
          poem._id.toString(),
          true,
        );

      poem.slug = slug;
      poem.contentPlain = contentPlain;
      poem.readingTimeMinutes = readingTimeMinutes ?? poem.readingTimeMinutes;
    }

    if (dto.title !== undefined) poem.title = dto.title;
    if (dto.content !== undefined) poem.content = dto.content;
    if (dto.excerpt !== undefined) poem.excerpt = dto.excerpt;
    if (dto.coverImage !== undefined) poem.coverImage = dto.coverImage;
    if (dto.tags !== undefined) poem.tags = dto.tags;
    if (dto.seoTitle !== undefined) poem.seoTitle = dto.seoTitle;
    if (dto.seoDescription !== undefined)
      poem.seoDescription = dto.seoDescription;

    if (dto.category !== undefined) {
      poem.category = dto.category ? new Types.ObjectId(dto.category) : null;
    }

    if (dto.featured !== undefined) poem.featured = dto.featured;

    if (dto.status !== undefined && dto.status !== poem.status) {
      poem.publishedAt = computePublishedAt(
        dto.status,
        poem.publishedAt ?? null,
      );
      poem.status = dto.status;
    }

    return poem.save();
  }

  async updateStatus(
    id: string,
    status: 'draft' | 'published' | 'archived',
  ): Promise<PoemDocument> {
    const poem = await this.findByIdOrFail(id);
    if (poem.status !== status) {
      poem.publishedAt = computePublishedAt(status, poem.publishedAt ?? null);
      poem.status = status;
    }
    return poem.save();
  }

  async updateFeatured(id: string, featured: boolean): Promise<PoemDocument> {
    const poem = await this.findByIdOrFail(id);
    poem.featured = featured;
    return poem.save();
  }

  async softDelete(id: string): Promise<{ success: true }> {
    const poem = await this.findByIdOrFail(id);
    poem.status = 'archived';
    poem.publishedAt = null;
    await poem.save();
    return { success: true };
  }

  async hardDelete(id: string): Promise<{ success: true }> {
    const poem = await this.findByIdOrFail(id);
    await this.poemModel.deleteOne({ _id: poem._id }).exec();
    return { success: true };
  }

  async incrementViewBySlug(slug: string): Promise<{ success: true }> {
    await this.poemModel
      .updateOne(
        { slug, status: 'published' },
        { $inc: { viewCount: 1 } },
      )
      .exec();
    return { success: true };
  }

  // ----------------------------------
  // helpers
  // ----------------------------------

  private applyCommonFilters(
    filter: FilterQuery<PoemDocument>,
    query: PoemQueryDto,
  ) {
    if (query.category) filter.category = new Types.ObjectId(query.category);
    if (query.tag) filter.tags = query.tag;
    if (query.featured === 'true') filter.featured = true;
    if (query.search) {
      filter.$text = { $search: query.search };
    }
  }

  private resolveSort(
    sort?: 'latest' | 'oldest' | 'popular',
  ): Record<string, 1 | -1> {
    switch (sort) {
      case 'oldest':
        return { publishedAt: 1, createdAt: 1 };
      case 'popular':
        return { viewCount: -1, publishedAt: -1 };
      case 'latest':
      default:
        return { publishedAt: -1, createdAt: -1 };
    }
  }

  private async paginate(
    filter: FilterQuery<PoemDocument>,
    query: PoemQueryDto,
    sort: Record<string, 1 | -1>,
    populateCategory = false,
  ): Promise<PaginatedResult<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      (() => {
        const q = this.poemModel
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit);
        if (populateCategory) q.populate('category', 'name nameEn slug');
        else q.populate('category', 'name nameEn slug');
        return q.lean().exec();
      })(),
      this.poemModel.countDocuments(filter).exec(),
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