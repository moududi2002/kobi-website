//apps/api/src/modules/homepage/homepage.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Homepage,
  HomepageDocument,
  HOMEPAGE_SINGLETON_ID,
  ABOUT_SINGLETON_ID,
  Poem,
  PoemDocument,
  Lyric,
  LyricDocument,
  About,
  AboutDocument,
} from '../../schemas';
import { UpdateHomepageDto } from './dto/homepage.dto';

@Injectable()
export class HomepageService {
  constructor(
    @InjectModel(Homepage.name)
    private readonly homepageModel: Model<HomepageDocument>,
    @InjectModel(Poem.name)
    private readonly poemModel: Model<PoemDocument>,
    @InjectModel(Lyric.name)
    private readonly lyricModel: Model<LyricDocument>,
    @InjectModel(About.name)
    private readonly aboutModel: Model<AboutDocument>,
  ) {}

  async get(): Promise<HomepageDocument> {
    const doc = await this.homepageModel.findOneAndUpdate(
      { singletonKey: HOMEPAGE_SINGLETON_ID },
      {
        $setOnInsert: {
          singletonKey: HOMEPAGE_SINGLETON_ID,
          heroSlides: [],
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    );
    return doc!;
  }

  /**
 * Aggregate homepage data — one round-trip for the frontend.
 */
async getFull() {
  const [
    homepage,
    latestPoems,
    latestLyrics,
    featuredPoems,
    featuredLyrics,
    about,
  ] = await Promise.all([
    this.getPublic(),
    this.poemModel
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(6)
      .select('title slug excerpt coverImage publishedAt viewCount readingTimeMinutes')
      .populate('category', 'name nameEn slug')
      .lean(),
    this.lyricModel
      .find({ status: 'published' })
      .sort({ publishedAt: -1 })
      .limit(6)
      .select('title slug excerpt youtubeVideoId publishedAt viewCount')
      .populate('category', 'name nameEn slug')
      .lean(),
    this.poemModel
      .find({ status: 'published', featured: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title slug excerpt coverImage publishedAt')
      .lean(),
    this.lyricModel
      .find({ status: 'published', featured: true })
      .sort({ publishedAt: -1 })
      .limit(3)
      .select('title slug excerpt youtubeVideoId publishedAt')
      .populate('category', 'name nameEn slug')
      .lean(),
    this.aboutModel
      .findOne({ singletonKey: ABOUT_SINGLETON_ID })
      .select('shortBio portraitImage literaryIdentity')
      .lean(),
  ]);

  return {
    homepage,
    latestPoems,
    latestLyrics,
    featuredPoems,
    featuredLyrics,
    about: about || null,
  };
}

  /**
   * Public response with featured content fully populated.
   */
  async getPublic() {
    const doc = await this.get();

    const [featuredPoem, featuredLyric] = await Promise.all([
      doc.featuredPoemId
        ? this.poemModel
            .findOne({ _id: doc.featuredPoemId, status: 'published' })
            .select('title slug excerpt content coverImage publishedAt')
            .lean()
        : null,
      doc.featuredLyricId
        ? this.lyricModel
            .findOne({ _id: doc.featuredLyricId, status: 'published' })
            .select('title slug excerpt content youtubeVideoId publishedAt')
            .populate('category', 'name nameEn slug')
            .lean()
        : null,
    ]);

    return {
      heroSlides: doc.heroSlides,
      featuredPoem,
      featuredLyric,
      welcomeQuote: doc.welcomeQuote ?? '',
      updatedAt: doc.updatedAt,
    };
  }

  async update(dto: UpdateHomepageDto): Promise<HomepageDocument> {
    const set: Record<string, any> = {};

    if (dto.heroSlides !== undefined) {
      set.heroSlides = dto.heroSlides;
    }
    if (dto.welcomeQuote !== undefined) {
      set.welcomeQuote = dto.welcomeQuote;
    }
    if (dto.featuredPoemId !== undefined) {
      // verify poem exists and is published
      if (dto.featuredPoemId) {
        const poem = await this.poemModel.findOne({
          _id: dto.featuredPoemId,
          status: 'published',
        });
        if (!poem) {
          throw new BadRequestException(
            'Featured poem পাওয়া যায়নি বা published নয়'
          );
        }
        set.featuredPoemId = new Types.ObjectId(dto.featuredPoemId);
      } else {
        set.featuredPoemId = null;
      }
    }
    if (dto.featuredLyricId !== undefined) {
      if (dto.featuredLyricId) {
        const lyric = await this.lyricModel.findOne({
          _id: dto.featuredLyricId,
          status: 'published',
        });
        if (!lyric) {
        throw new BadRequestException(
          'Featured lyric পাওয়া যায়নি বা published নয়'
        );
        }
        set.featuredLyricId = new Types.ObjectId(dto.featuredLyricId);
      } else {
        set.featuredLyricId = null;
      }
    }

    const doc = await this.homepageModel.findOneAndUpdate(
      { singletonKey: HOMEPAGE_SINGLETON_ID },
      {
        $set: set,
        $setOnInsert: { singletonKey: HOMEPAGE_SINGLETON_ID },
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return doc!;
  }
}