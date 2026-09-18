// apps/api/src/schemas/homepage.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Document, Types } from 'mongoose';

export type HomepageDocument = HydratedDocument<Homepage>;

export const HOMEPAGE_SINGLETON_ID = 'singleton-homepage';

@Schema({ _id: false })
export class HeroSlide {
  @Prop({ type: String, required: true })
  image: string;

  @Prop({ type: String, default: '' })
  title?: string;

  @Prop({ type: String, default: '' })
  subtitle?: string;

  @Prop({ type: String, default: '' })
  quote?: string;
}

export const HeroSlideSchema =
  SchemaFactory.createForClass(HeroSlide);

@Schema({
  timestamps: true,
  collection: 'homepages',
  versionKey: false,
})
export class Homepage extends Document {
  @Prop({
    type: String,
    default: HOMEPAGE_SINGLETON_ID,
    unique: true,
    index: true,
  })
  singletonKey: string;

  @Prop({
    type: [HeroSlideSchema],
    default: [],
  })
  heroSlides: HeroSlide[];

  @Prop({
    type: Types.ObjectId,
    ref: 'Poem',
    default: null,
  })
  featuredPoemId?: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: 'Lyric',
    default: null,
  })
  featuredLyricId?: Types.ObjectId | null;

  @Prop({
    type: String,
    default: '',
  })
  welcomeQuote?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const HomepageSchema =
  SchemaFactory.createForClass(Homepage);
