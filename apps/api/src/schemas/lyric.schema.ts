// apps/api/src/schemas/lyric.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

export type LyricDocument = HydratedDocument<Lyric>;

export type LyricStatus = 'draft' | 'published' | 'archived';

@Schema({
  timestamps: true,
  collection: 'lyrics',
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: any) => {
      delete ret.contentPlain;
      return ret;
    },
  },
})
export class Lyric extends Document {
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

  /** HTML lyrics */
  @Prop({ type: String, required: true })
  content: string;

  @Prop({ type: String, default: '', index: 'text' })
  contentPlain: string;

  /**
   * YouTube preview — stored at the beginning of the lyric page.
   */
  @Prop({ type: String, default: null })
  youtubeVideoId?: string | null;

  @Prop({ type: String, default: null })
  youtubeUrl?: string | null;

  /** Category reference — হামদ, নাতে রাসুল, etc. */
  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true,
  })
  category: Types.ObjectId;

  @Prop({ type: [String], default: [], index: true })
  tags: string[];

  @Prop({
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    index: true,
  })
  status: LyricStatus;

  @Prop({ type: Date, default: null, index: true })
  publishedAt?: Date | null;

  @Prop({ type: Boolean, default: false, index: true })
  featured: boolean;

  @Prop({ type: Number, default: 0 })
  viewCount: number;

  @Prop({ type: String, default: '', maxlength: 200 })
  seoTitle?: string;

  @Prop({ type: String, default: '', maxlength: 500 })
  seoDescription?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const LyricSchema = SchemaFactory.createForClass(Lyric);

LyricSchema.index({ title: 'text', contentPlain: 'text', tags: 'text' });

LyricSchema.index({ status: 1, publishedAt: -1 });
LyricSchema.index({ category: 1, status: 1, publishedAt: -1 });
LyricSchema.index({ status: 1, featured: 1, publishedAt: -1 });