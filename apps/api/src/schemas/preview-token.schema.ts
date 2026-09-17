// apps/api/src/schemas/preview-token.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

export type PreviewTokenDocument = HydratedDocument<PreviewToken>;

export type PreviewContentType = 'poem' | 'lyric' | 'about' | 'homepage';

@Schema({
  timestamps: true,
  collection: 'preview_tokens',
  versionKey: false,
})
export class PreviewToken extends Document {
  /** Random, URL-safe token (nanoid) */
  @Prop({ type: String, required: true, unique: true, index: true })
  token: string;

  @Prop({
    type: String,
    enum: ['poem', 'lyric', 'about', 'homepage'],
    required: true,
  })
  contentType: PreviewContentType;

  @Prop({
    type: Types.ObjectId,
    required: true,
    index: true,
  })
  contentId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const PreviewTokenSchema = SchemaFactory.createForClass(PreviewToken);

/** Auto-expire via TTL */
PreviewTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });