// apps/api/src/schemas/poem.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

export type PoemDocument = HydratedDocument<Poem>;

export type ContentStatus = 'draft' | 'published' | 'archived';

@Schema({
  timestamps: true,
  collection: 'poems',
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      delete ret.contentPlain;
      return ret;
    },
  },
})
export class Poem extends Document {
  @Prop({
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 300,
    index: true,
  })
  title: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
    trim: true,
  })
  slug: string;

  @Prop({ type: String, default: '', trim: true, maxlength: 500 })
  excerpt?: string;

  /** Rich text HTML from TipTap */
  @Prop({ type: String, required: true })
  content: string;

  /** HTML-stripped version for text search (not returned to client) */
  @Prop({ type: String, default: '', index: 'text' })
  contentPlain: string;

  @Prop({ type: String, default: null })
  coverImage?: string | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    default: null,
    index: true,
  })
  category?: Types.ObjectId | null;

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop({
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  })
  status: ContentStatus;

  @Prop({ type: Date, default: null, index: true })
  publishedAt?: Date | null;

  @Prop({ type: Boolean, default: false, index: true })
  featured: boolean;

  @Prop({ type: Number, default: 0 })
  viewCount: number;

  @Prop({ type: Number, default: 1, min: 1 })
  readingTimeMinutes: number;

  @Prop({ type: String, default: '', maxlength: 200 })
  seoTitle?: string;

  @Prop({ type: String, default: '', maxlength: 500 })
  seoDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const PoemSchema = SchemaFactory.createForClass(Poem);

/** Text index for search */
PoemSchema.index({ title: 'text', contentPlain: 'text', tags: 'text' });

/** Public listing queries */
PoemSchema.index({ status: 1, publishedAt: -1 });
PoemSchema.index({ status: 1, featured: 1, publishedAt: -1 });
PoemSchema.index({ category: 1, status: 1, publishedAt: -1 });