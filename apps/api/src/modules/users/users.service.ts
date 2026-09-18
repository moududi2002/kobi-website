// apps/api/src/modules/users/users.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User, UserDocument, UserRole } from '../../schemas';
import { hashPassword } from '../../common/utils/password.util';

export interface CreateUserInput {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  /**
   * Find a user by email.
   * `includePassword: true` is required for login validation.
   */
  async findByEmail(
    email: string,
    includePassword = false,
  ): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email: email.toLowerCase() });
    if (includePassword) query.select('+password');
    return query.exec();
  }

  async findById(
    id: string | Types.ObjectId,
    includePassword = false,
  ): Promise<UserDocument | null> {
    const query = this.userModel.findById(id);
    if (includePassword) query.select('+password');
    return query.exec();
  }

  async create(input: CreateUserInput): Promise<UserDocument> {
    const hashed = await hashPassword(input.password);
    const user = new this.userModel({
      email: input.email.toLowerCase(),
      password: hashed,
      name: input.name,
      role: input.role || 'admin',
      isActive: true,
    });
    return user.save();
  }

  async updateLastLogin(userId: string | Types.ObjectId): Promise<void> {
    await this.userModel
      .updateOne({ _id: userId }, { $set: { lastLoginAt: new Date() } })
      .exec();
  }

  async getByIdOrFail(id: string): Promise<UserDocument> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}