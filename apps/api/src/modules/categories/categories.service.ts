// apps/api/src/modules/categories/categories.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDocument } from '../../schemas';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
} from './dto/category.dto';
import { generateSlug, ensureUniqueSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {}

  // ------------- public -------------

  async findAllPublic(type?: 'poem' | 'lyric') {
    const filter: any = {};
    if (type) filter.type = type;
    return this.categoryModel.find(filter).sort({ type: 1, order: 1 }).lean();
  }

  async findBySlugPublic(slug: string) {
    const cat = await this.categoryModel.findOne({ slug }).lean();
    if (!cat) throw new NotFoundException('Category পাওয়া যায়নি');
    return cat;
  }

  // ------------- admin -------------

  async findAllAdmin(type?: 'poem' | 'lyric') {
    const filter: any = {};
    if (type) filter.type = type;
    return this.categoryModel.find(filter).sort({ type: 1, order: 1 }).lean();
  }

  async findByIdOrFail(id: string): Promise<CategoryDocument> {
    const cat = await this.categoryModel.findById(id);
    if (!cat) throw new NotFoundException('Category পাওয়া যায়নি');
    return cat;
  }

  async create(dto: CreateCategoryDto): Promise<CategoryDocument> {
    const baseSlug = dto.slug ? generateSlug(dto.slug) : generateSlug(dto.nameEn);
    const slug = await ensureUniqueSlug(this.categoryModel, baseSlug);

    try {
      const cat = new this.categoryModel({
        name: dto.name,
        nameEn: dto.nameEn,
        slug,
        description: dto.description || '',
        type: dto.type,
        order: dto.order ?? 0,
        isSystem: false,
      });
      return await cat.save();
    } catch (err: any) {
      if (err.code === 11000) {
        throw new ConflictException('এই slug আগে থেকেই আছে');
      }
      throw err;
    }
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<CategoryDocument> {
    const cat = await this.findByIdOrFail(id);

    // System category: name can change, but slug cannot & cannot change type
    if (cat.isSystem) {
      if (dto.type && dto.type !== cat.type) {
        throw new BadRequestException(
          'System category-র type পরিবর্তন করা যাবে না',
        );
      }
      if (dto.slug && dto.slug !== cat.slug) {
        throw new BadRequestException(
          'System category-র slug পরিবর্তন করা যাবে না',
        );
      }
    }

    if (dto.name !== undefined) cat.name = dto.name;
    if (dto.nameEn !== undefined) cat.nameEn = dto.nameEn;
    if (dto.description !== undefined) cat.description = dto.description;
    if (dto.order !== undefined) cat.order = dto.order;

    if (dto.slug && !cat.isSystem) {
      const baseSlug = generateSlug(dto.slug);
      cat.slug = await ensureUniqueSlug(
        this.categoryModel,
        baseSlug,
        cat._id.toString(),
      );
    } else if (dto.nameEn && !dto.slug && !cat.isSystem) {
      // if nameEn changed & no slug provided, regenerate slug? No — keep stable.
      // (slug stability is good for SEO)
    }

    return cat.save();
  }

  async remove(id: string): Promise<{ success: true }> {
    const cat = await this.findByIdOrFail(id);
    if (cat.isSystem) {
      throw new BadRequestException(
        'System category মুছে ফেলা যাবে না',
      );
    }
    await this.categoryModel.deleteOne({ _id: cat._id }).exec();
    return { success: true };
  }
}