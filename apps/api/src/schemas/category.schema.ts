// apps/api/src/schemas/category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

export type CategoryType = 'poem' | 'lyric';

@Schema({
  timestamps: true,
  collection: 'categories',
  versionKey: false,
})
export class Category extends Document {
  @Prop({
    type: String,
    required: [true, 'Name (Bangla) is required'],
    trim: true,
    maxlength: 100,
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Name (English) is required'],
    trim: true,
    maxlength: 100,
  })
  nameEn: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  slug: string;

  @Prop({ type: String, default: '', trim: true, maxlength: 500 })
  description?: string;

  @Prop({
    type: String,
    enum: ['poem', 'lyric'],
    required: true,
    index: true,
  })
  type: CategoryType;

  @Prop({ type: Number, default: 0, index: true })
  order: number;

  /**
   * System categories (হামদ, নাতে রাসুল, মায়ের গান, দেশাত্মবোধক, রম্য)
   * cannot be deleted from the dashboard.
   */
  @Prop({ type: Boolean, default: false })
  isSystem: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ type: 1, order: 1 });
CategorySchema.index({ type: 1, slug: 1 }, { unique: true });