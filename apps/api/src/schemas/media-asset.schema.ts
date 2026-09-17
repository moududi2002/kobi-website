// apps/api/src/schemas/media-asset.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

export type MediaAssetDocument = HydratedDocument<MediaAsset>;

@Schema({
  timestamps: true,
  collection: 'media_assets',
  versionKey: false,
})
export class MediaAsset extends Document {
  @Prop({ type: String, required: true, index: true })
  publicId: string;

  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: String, required: true })
  secureUrl: string;

  @Prop({ type: String, required: true })
  format: string;

  @Prop({ type: Number, default: null })
  width?: number | null;

  @Prop({ type: Number, default: null })
  height?: number | null;

  @Prop({ type: Number, required: true })
  bytes: number;

  @Prop({ type: String, default: 'kobi-website', index: true })
  folder: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  uploadedBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

export const MediaAssetSchema = SchemaFactory.createForClass(MediaAsset);

MediaAssetSchema.index({ folder: 1, createdAt: -1 });