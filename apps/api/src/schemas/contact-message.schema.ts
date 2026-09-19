// apps/api/src/schemas/contact-message.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type ContactMessageDocument = HydratedDocument<ContactMessage>;

export type ContactMessageStatus = 'new' | 'read' | 'replied' | 'archived';

@Schema({
  timestamps: true,
  collection: 'contact_messages',
  versionKey: false,
})
export class ContactMessage extends Document {
  @Prop({ type: String, required: true, trim: true, maxlength: 120 })
  name: string;

  @Prop({ type: String, required: true, trim: true, lowercase: true, maxlength: 200 })
  email: string;

  @Prop({ type: String, default: '', trim: true, maxlength: 30 })
  phone?: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  subject: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 5000 })
  message: string;

  @Prop({
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new',
    index: true,
  })
  status: ContactMessageStatus;

  @Prop({ type: String, default: null })
  ipAddress?: string | null;

  @Prop({ type: String, default: null })
  userAgent?: string | null;

  @Prop({ type: Date, default: null })
  readAt?: Date | null;

  @Prop({ type: String, default: '' })
  adminNote?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const ContactMessageSchema = SchemaFactory.createForClass(ContactMessage);

ContactMessageSchema.index({ createdAt: -1 });
ContactMessageSchema.index({ status: 1, createdAt: -1 });