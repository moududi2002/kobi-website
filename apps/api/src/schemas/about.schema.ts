// apps/api/src/schemas/about.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document } from 'mongoose';

export type AboutDocument = HydratedDocument<About>;

/** Fixed singleton document id */
export const ABOUT_SINGLETON_ID = 'singleton-about';

@Schema({ _id: false })
export class TimelineEntry {
  @Prop({ type: String, required: true })
  year: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, default: '' })
  description?: string;
}

export const TimelineEntrySchema =
  SchemaFactory.createForClass(TimelineEntry);

@Schema({ _id: false })
export class SocialLink {
  @Prop({ type: String, required: true })
  platform: string;

  @Prop({ type: String, required: true })
  url: string;
}

export const SocialLinkSchema =
  SchemaFactory.createForClass(SocialLink);

@Schema({
  timestamps: true,
  collection: 'abouts',
  versionKey: false,
})
export class About extends Document {
  @Prop({
    type: String,
    default: ABOUT_SINGLETON_ID,
    unique: true,
    index: true,
  })
  singletonKey: string;

  @Prop({
    type: String,
    default: '',
    maxlength: 500,
  })
  shortBio: string;

  /** HTML biography */
  @Prop({
    type: String,
    default: '',
  })
  fullBio: string;

  @Prop({
    type: String,
    default: null,
  })
  portraitImage?: string | null;

  @Prop({
    type: String,
    default: '',
    maxlength: 300,
  })
  literaryIdentity?: string;

  @Prop({
    type: [String],
    default: [],
  })
  achievements: string[];

  @Prop({
    type: [TimelineEntrySchema],
    default: [],
  })
  timeline: TimelineEntry[];

  @Prop({
    type: String,
    default: '',
  })
  contactEmail?: string;

  @Prop({
    type: String,
    default: '',
  })
  contactPhone?: string;

  @Prop({
    type: [SocialLinkSchema],
    default: [],
  })
  socialLinks: SocialLink[];

  createdAt: Date;
  updatedAt: Date;
}

export const AboutSchema = SchemaFactory.createForClass(About);
