//apps/api/src/modules/contact/contact.service.ts
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, FilterQuery } from 'mongoose';

import {
  ContactMessage,
  ContactMessageDocument,
} from '../../schemas';
import {
  CreateContactMessageDto,
  ContactMessageQueryDto,
} from './dto/contact.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    @InjectModel(ContactMessage.name)
    private readonly contactModel: Model<ContactMessageDocument>,
  ) {}

  async create(
    dto: CreateContactMessageDto,
    meta?: { ipAddress?: string; userAgent?: string },
  ) {
    // Honeypot — bot detected
    if (dto.website && dto.website.trim().length > 0) {
      this.logger.warn(
        `Honeypot triggered from IP ${meta?.ipAddress}. Pretending success.`,
      );
      return { success: true, id: 'silent-ok' };
    }

    const doc = await this.contactModel.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone || '',
      subject: dto.subject,
      message: dto.message,
      status: 'new',
      ipAddress: meta?.ipAddress || null,
      userAgent: meta?.userAgent || null,
    });

    this.logger.log(
      `📬 New contact message from ${dto.email} — "${dto.subject}"`,
    );

    return { success: true, id: doc._id.toString() };
  }

  async findAll(query: ContactMessageQueryDto): Promise<PaginatedResult<any>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ContactMessageDocument> = {};
    if (query.status) filter.status = query.status;
    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { email: { $regex: query.search, $options: 'i' } },
        { subject: { $regex: query.search, $options: 'i' } },
      ];
    }

    const [items, total] = await Promise.all([
      this.contactModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      this.contactModel.countDocuments(filter),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findByIdOrFail(id: string): Promise<ContactMessageDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('অবৈধ ID');
    }
    const doc = await this.contactModel.findById(id);
    if (!doc) throw new NotFoundException('Message পাওয়া যায়নি');
    return doc;
  }

  async updateStatus(
    id: string,
    status: 'new' | 'read' | 'replied' | 'archived',
    adminNote?: string,
  ): Promise<ContactMessageDocument> {
    const doc = await this.findByIdOrFail(id);
    doc.status = status;
    if (status === 'read' && !doc.readAt) doc.readAt = new Date();
    if (adminNote !== undefined) doc.adminNote = adminNote;
    return doc.save();
  }

  async delete(id: string): Promise<{ success: true }> {
    const doc = await this.findByIdOrFail(id);
    await this.contactModel.deleteOne({ _id: doc._id });
    return { success: true };
  }

  async countNew(): Promise<number> {
    return this.contactModel.countDocuments({ status: 'new' });
  }
}