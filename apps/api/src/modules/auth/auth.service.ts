// apps/api/src/modules/auth/auth.service.ts
import {
  Injectable,
  UnauthorizedException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';

import { UsersService } from '../users/users.service';
import {
  User,
  UserDocument,
  RefreshToken,
  RefreshTokenDocument,
} from '../../schemas';
import { comparePassword } from '../../common/utils/password.util';
import {
  generateRefreshTokenRaw,
  hashToken,
  parseDurationMs,
} from '../../common/utils/token.util';
// import { JwtPayload, UserRole } from '@kobi/types';

type UserRole = 'admin' | 'user';
interface JwtPlayload {
    sub: string;
    email: string;
    role: UserRole;
}

export interface LoginResult {
  user: UserDocument;
  accessToken: string;
  expiresIn: number;
  refreshTokenRaw: string;
  refreshExpiresAt: Date;
}

export interface RefreshResult {
  accessToken: string;
  expiresIn: number;
  refreshTokenRaw: string;
  refreshExpiresAt: Date;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  /**
   * Validate credentials and issue tokens.
   */
  async login(
    email: string,
    password: string,
    meta?: { userAgent?: string; ipAddress?: string },
  ): Promise<LoginResult> {
    const user = await this.usersService.findByEmail(email, true);

    if (!user) {
      // Same generic message for both cases (timing attack mitigation)
      throw new UnauthorizedException('ভুল ইমেইল অথবা পাসওয়ার্ড');
    }

    if (!user.isActive) {
      throw new ForbiddenException('Account নিষ্ক্রিয় করা হয়েছে');
    }

    const ok = await comparePassword(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('ভুল ইমেইল অথবা পাসওয়ার্ড');
    }

    // Issue tokens
    const accessToken = await this.signAccessToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    });

    const refreshTokenRaw = generateRefreshTokenRaw();
    const refreshTokenHash = hashToken(refreshTokenRaw);

    const refreshExpiresIn = this.config.get<string>(
      'jwt.refreshExpiresIn',
    )!;
    const refreshExpiresAt = new Date(
      Date.now() + parseDurationMs(refreshExpiresIn),
    );

    await this.refreshTokenModel.create({
      userId: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: refreshExpiresAt,
      revoked: false,
      userAgent: meta?.userAgent || null,
      ipAddress: meta?.ipAddress || null,
    });

    await this.usersService.updateLastLogin(user._id);

    return {
      user,
      accessToken,
      expiresIn: this.getAccessExpiresInSeconds(),
      refreshTokenRaw,
      refreshExpiresAt,
    };
  }

  /**
   * Exchange a valid refresh token for a new access + refresh pair (rotation).
   */
  async refresh(
    refreshTokenRaw: string,
    meta?: { userAgent?: string; ipAddress?: string },
  ): Promise<RefreshResult> {
    if (!refreshTokenRaw) {
      throw new UnauthorizedException('Refresh token নেই');
    }

    const tokenHash = hashToken(refreshTokenRaw);
    const record = await this.refreshTokenModel.findOne({ tokenHash });

    if (!record) {
      throw new UnauthorizedException('অবৈধ refresh token');
    }

    if (record.revoked) {
      // Token reuse detected — revoke all sessions for safety
      this.logger.warn(
        `Refresh token reuse detected for user ${record.userId}. Revoking all sessions.`,
      );
      await this.refreshTokenModel.updateMany(
        { userId: record.userId, revoked: false },
        { $set: { revoked: true, revokedAt: new Date() } },
      );
      throw new UnauthorizedException('Refresh token বাতিল হয়েছে');
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Refresh token মেয়াদোত্তীর্ণ');
    }

    const user = await this.usersService.findById(record.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User নিষ্ক্রিয়');
    }

    // Rotate: revoke old
    record.revoked = true;
    record.revokedAt = new Date();
    await record.save();

    // Issue new
    const accessToken = await this.signAccessToken({
      sub: user._id.toString(),
      email: user.email,
      role: user.role as UserRole,
    });

    const newRefreshRaw = generateRefreshTokenRaw();
    const newRefreshHash = hashToken(newRefreshRaw);
    const refreshExpiresIn = this.config.get<string>(
      'jwt.refreshExpiresIn',
    )!;
    const refreshExpiresAt = new Date(
      Date.now() + parseDurationMs(refreshExpiresIn),
    );

    await this.refreshTokenModel.create({
      userId: user._id,
      tokenHash: newRefreshHash,
      expiresAt: refreshExpiresAt,
      revoked: false,
      userAgent: meta?.userAgent || null,
      ipAddress: meta?.ipAddress || null,
    });

    return {
      accessToken,
      expiresIn: this.getAccessExpiresInSeconds(),
      refreshTokenRaw: newRefreshRaw,
      refreshExpiresAt,
    };
  }

  /**
   * Revoke the provided refresh token.
   */
  async logout(refreshTokenRaw?: string): Promise<void> {
    if (!refreshTokenRaw) return;
    const tokenHash = hashToken(refreshTokenRaw);
    await this.refreshTokenModel
      .updateOne(
        { tokenHash, revoked: false },
        { $set: { revoked: true, revokedAt: new Date() } },
      )
      .exec();
  }

  /**
   * Revoke all sessions for a user.
   */
  async logoutAll(userId: string | Types.ObjectId): Promise<void> {
    await this.refreshTokenModel
      .updateMany(
        { userId, revoked: false },
        { $set: { revoked: true, revokedAt: new Date() } },
      )
      .exec();
  }

  // ---------- helpers ----------

  private async signAccessToken(payload: JwtPlayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  private getAccessExpiresInSeconds(): number {
    const duration = this.config.get<string>('jwt.accessExpiresIn') || '15m';
    return Math.floor(parseDurationMs(duration) / 1000);
  }
}