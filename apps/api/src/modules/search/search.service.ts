// apps/api/src/modules/search/search.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import {
  Poem,
  PoemDocument,
  Lyric,
  LyricDocument,
} from '../../schemas';
import { SearchQueryDto, SearchType } from './dto/search.dto';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Poem.name)
    private readonly poemModel: Model<PoemDocument>,
    @InjectModel(Lyric.name)
    private readonly lyricModel: Model<LyricDocument>,
  ) {}

  async search(dto: SearchQueryDto) {
    const { q, type, page, limit } = dto;
    const skip = (page - 1) * limit;

    // MongoDB $text search
    const textFilter = { $text: { $search: q } };

    const tasks: Promise<any>[] = [];

    // ---------------- POEMS ----------------
    if (type === SearchType.ALL || type === SearchType.POEM) {
      const poemFilter: FilterQuery<PoemDocument> = {
        ...textFilter,
        status: 'published',
      };

      tasks.push(
        Promise.all([
          this.poemModel
            .find(poemFilter, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limit)
            .select('title slug excerpt coverImage publishedAt viewCount')
            .populate('category', 'name nameEn slug')
            .lean()
            .exec(),
          this.poemModel.countDocuments(poemFilter).exec(),
        ]).then(([items, total]) => ({
          kind: 'poems',
          items,
          total,
        })),
      );
    }

    // ---------------- LYRICS ----------------
    if (type === SearchType.ALL || type === SearchType.LYRIC) {
      const lyricFilter: FilterQuery<LyricDocument> = {
        ...textFilter,
        status: 'published',
      };

      tasks.push(
        Promise.all([
          this.lyricModel
            .find(lyricFilter, { score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limit)
            .select(
              'title slug excerpt youtubeVideoId publishedAt viewCount',
            )
            .populate('category', 'name nameEn slug')
            .lean()
            .exec(),
          this.lyricModel.countDocuments(lyricFilter).exec(),
        ]).then(([items, total]) => ({
          kind: 'lyrics',
          items,
          total,
        })),
      );
    }

    const results = await Promise.all(tasks);

    const poems = results.find((r) => r.kind === 'poems') ?? {
      items: [],
      total: 0,
    };
    const lyrics = results.find((r) => r.kind === 'lyrics') ?? {
      items: [],
      total: 0,
    };

    return {
      query: q,
      type,
      poems: {
        items: poems.items,
        total: poems.total,
      },
      lyrics: {
        items: lyrics.items,
        total: lyrics.total,
      },
      meta: {
        page,
        limit,
      },
    };
  }
}