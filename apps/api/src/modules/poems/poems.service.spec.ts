import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';

import { PoemsService } from './poems.service';
import { Poem } from '../../schemas';

describe('PoemsService', () => {
  let service: PoemsService;
  let model: any;

  const validId = '507f1f77bcf86cd799439011';
  const fakePoem = {
    _id: validId,
    title: 'বৃষ্টির দিনে',
    slug: 'বৃষ্টির-দিনে',
    content: '<p>x</p>',
    contentPlain: 'x',
    status: 'draft',
    publishedAt: null,
    featured: false,
    viewCount: 0,
    readingTimeMinutes: 1,
    tags: [],
    save: jest.fn(),
  };

  beforeEach(async () => {
    model = {
      findById: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      exists: jest.fn().mockResolvedValue(false),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PoemsService,
        { provide: getModelToken(Poem.name), useValue: model },
      ],
    }).compile();

    service = module.get<PoemsService>(PoemsService);
  });

  describe('findByIdOrFail', () => {
    it('throws BadRequestException for invalid ObjectId', async () => {
      await expect(service.findByIdOrFail('not-an-id')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('throws NotFoundException when not found', async () => {
      model.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });
      await expect(service.findByIdOrFail(validId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateStatus', () => {
    it('sets publishedAt when transitioning to published', async () => {
      const localPoem = { ...fakePoem, save: jest.fn().mockResolvedValue(true) };
      jest.spyOn(service, 'findByIdOrFail').mockResolvedValue(localPoem as any);
      await service.updateStatus(validId, 'published');
      expect(localPoem.status).toBe('published');
      expect(localPoem.publishedAt).toBeInstanceOf(Date);
    });

    it('nullifies publishedAt when transitioning to draft', async () => {
      const localPoem = {
        ...fakePoem,
        status: 'published',
        publishedAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(service, 'findByIdOrFail').mockResolvedValue(localPoem as any);
      await service.updateStatus(validId, 'draft');
      expect(localPoem.status).toBe('draft');
      expect(localPoem.publishedAt).toBeNull();
    });
  });

  describe('softDelete', () => {
    it('sets status=archived and clears publishedAt', async () => {
      const localPoem = {
        ...fakePoem,
        status: 'published',
        publishedAt: new Date(),
        save: jest.fn().mockResolvedValue(true),
      };
      jest.spyOn(service, 'findByIdOrFail').mockResolvedValue(localPoem as any);
      await service.softDelete(validId);
      expect(localPoem.status).toBe('archived');
      expect(localPoem.publishedAt).toBeNull();
    });
  });

  describe('incrementViewBySlug', () => {
    it('calls updateOne with $inc', async () => {
      model.updateOne.mockReturnValue({ exec: jest.fn().mockResolvedValue({}) });
      await service.incrementViewBySlug('some-slug');
      expect(model.updateOne).toHaveBeenCalledWith(
        { slug: 'some-slug', status: 'published' },
        { $inc: { viewCount: 1 } },
      );
    });
  });
});