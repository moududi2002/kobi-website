// apps/api/src/schemas/refresh-token.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;

@Schema({
  timestamps: true,
  collection: 'refresh_tokens',
  versionKey: false,
})
export class RefreshToken extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  })
  userId: Types.ObjectId;

  /**
   * We store SHA-256 hash of the raw refresh token.
   * Raw token stays only in the HTTP-only cookie on client.
   */
  @Prop({ type: String, required: true, unique: true, index: true })
  tokenHash: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Boolean, default: false, index: true })
  revoked: boolean;

  @Prop({ type: Date, default: null })
  revokedAt?: Date | null;

  @Prop({ type: String, default: null })
  userAgent?: string | null;

  @Prop({ type: String, default: null })
  ipAddress?: string | null;

  createdAt: Date;
  updatedAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

/**
 * TTL index: Mongo will auto-delete expired documents.
 * Expire after 0 seconds past `expiresAt`.
 */
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/**
 * Compound index for cleanup queries.
 */
RefreshTokenSchema.index({ userId: 1, revoked: 1 });