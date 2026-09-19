// apps/api/src/modules/auth/auth.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RefreshToken } from '../../schemas';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let configService: Partial<ConfigService>;
  let refreshTokenModel: any;

  const fakeUser = {
    _id: '507f1f77bcf86cd799439011',
    email: 'admin@kobi.com',
    name: 'Admin',
    role: 'admin',
    isActive: true,
    password: '',
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    fakeUser.password = await bcrypt.hash('ChangeMe@123', 10);
  });

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateLastLogin: jest.fn(),
    };

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('fake-access-token'),
    };

    configService = {
      get: jest.fn((key: string) => {
        const map: Record<string, any> = {
          'jwt.refreshExpiresIn': '7d',
          'jwt.accessExpiresIn': '15m',
        };
        return map[key];
      }),
    };

    refreshTokenModel = {
    create: jest.fn().mockResolvedValue({}),

    findOne: jest.fn(),

    updateOne: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
    }),

    updateMany: jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
    }),
    };


    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
        {
          provide: getModelToken(RefreshToken.name),
          useValue: refreshTokenModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login('a@b.com', 'pass'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException on wrong password', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue({
        ...fakeUser,
        password: await bcrypt.hash('different', 10),
      });
      await expect(
        service.login('admin@kobi.com', 'wrong'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return access token + refresh token on success', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(fakeUser);
      const result = await service.login('admin@kobi.com', 'ChangeMe@123');
      expect(result.accessToken).toBe('fake-access-token');
      expect(result.refreshTokenRaw).toBeDefined();
      expect(result.refreshExpiresAt).toBeInstanceOf(Date);
      expect(refreshTokenModel.create).toHaveBeenCalled();
      expect(usersService.updateLastLogin).toHaveBeenCalledWith(fakeUser._id);
    });
  });

  describe('refresh', () => {
    it('should throw if token not found', async () => {
      refreshTokenModel.findOne.mockResolvedValue(null);
      await expect(service.refresh('badtoken')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw + revoke all if token is revoked (reuse detection)', async () => {
      refreshTokenModel.findOne.mockResolvedValue({
        userId: fakeUser._id,
        revoked: true,
        expiresAt: new Date(Date.now() + 10000),
      });
      await expect(service.refresh('reused')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(refreshTokenModel.updateMany).toHaveBeenCalled();
    });

    it('should rotate tokens on valid refresh', async () => {
      const validRecord = {
        userId: fakeUser._id,
        revoked: false,
        expiresAt: new Date(Date.now() + 10000),
        save: jest.fn().mockResolvedValue(undefined),
      };
      refreshTokenModel.findOne.mockResolvedValue(validRecord);
      (usersService.findById as jest.Mock).mockResolvedValue(fakeUser);

      const result = await service.refresh('validtoken');
      expect(validRecord.revoked).toBe(true);
      expect(result.accessToken).toBe('fake-access-token');
      expect(refreshTokenModel.create).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should no-op when no token provided', async () => {
      await service.logout(undefined);
      expect(refreshTokenModel.updateOne).not.toHaveBeenCalled();
    });

    it('should revoke the token', async () => {
      await service.logout('sometoken');
      expect(refreshTokenModel.updateOne).toHaveBeenCalled();
    });
  });
});