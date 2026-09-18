// apps/api/src/modules/auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags, ApiOperation, ApiResponse, ApiCookieAuth, ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  LoginResponseDto,
  RefreshResponseDto,
  AuthUserDto,
} from './dto/auth-response.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser, AuthUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';

import { Throttle } from '@nestjs/throttler';


const REFRESH_COOKIE = 'refresh_token';
const REFRESH_COOKIE_PATH = '/api/v1/auth';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
  ) {}

  // -------------------------------------------------------
  // POST /auth/login
  // -------------------------------------------------------
  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 15 * 60_000 } }) // 5 attempts per 15 min
  @ApiOperation({ summary: 'লগইন (admin/author)' })
  @ApiResponse({ status: 200, type: LoginResponseDto })
  @ApiResponse({ status: 401, description: 'ভুল credentials' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginResponseDto> {
    const result = await this.authService.login(dto.email, dto.password, {
      userAgent: req.get('user-agent') || undefined,
      ipAddress: req.ip,
    });

    this.setRefreshCookie(res, result.refreshTokenRaw, result.refreshExpiresAt);

    const user = result.user;
    return {
      user: {
        _id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
        lastLoginAt: user.lastLoginAt?.toISOString(),
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      },
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    };
  }

  // -------------------------------------------------------
  // POST /auth/refresh
  // -------------------------------------------------------
  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Access token রিফ্রেশ' })
  @ApiCookieAuth('refresh_token')
  @ApiResponse({ status: 200, type: RefreshResponseDto })
  @ApiResponse({ status: 401, description: 'Refresh token অবৈধ' })
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<RefreshResponseDto> {
    const raw = req.cookies?.[REFRESH_COOKIE];
    const result = await this.authService.refresh(raw, {
      userAgent: req.get('user-agent') || undefined,
      ipAddress: req.ip,
    });

    this.setRefreshCookie(res, result.refreshTokenRaw, result.refreshExpiresAt);

    return {
      accessToken: result.accessToken,
      expiresIn: result.expiresIn,
    };
  }

  // -------------------------------------------------------
  // POST /auth/logout
  // -------------------------------------------------------
  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'লগআউট (refresh token revoke)' })
  @ApiCookieAuth('refresh_token')
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const raw = req.cookies?.[REFRESH_COOKIE];
    await this.authService.logout(raw);
    this.clearRefreshCookie(res);
    return { success: true, message: 'লগআউট সম্পন্ন' };
  }

  // -------------------------------------------------------
  // POST /auth/logout-all   (protected)
  // -------------------------------------------------------
  @Post('logout-all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'সব সেশন থেকে লগআউট' })
  async logoutAll(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logoutAll(user.userId);
    this.clearRefreshCookie(res);
    return { success: true, message: 'সব সেশন থেকে লগআউট সম্পন্ন' };
  }

  // -------------------------------------------------------
  // GET /auth/me   (protected)
  // -------------------------------------------------------
  @Get('me')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'বর্তমান লগইনকৃত ইউজার' })
  @ApiResponse({ status: 200, type: AuthUserDto })
  async me(@CurrentUser() authUser: AuthUser): Promise<AuthUserDto> {
    const user = await this.usersService.getByIdOrFail(authUser.userId);
    return {
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt?.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  // -------------------------------------------------------
  // Cookie helpers
  // -------------------------------------------------------
  private setRefreshCookie(res: Response, token: string, expiresAt: Date) {
    const isProd = this.config.get<string>('nodeEnv') === 'production';
    res.cookie(REFRESH_COOKIE, token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: REFRESH_COOKIE_PATH,
      expires: expiresAt,
    });
  }

  private clearRefreshCookie(res: Response) {
    const isProd = this.config.get<string>('nodeEnv') === 'production';
    res.clearCookie(REFRESH_COOKIE, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'strict' : 'lax',
      path: REFRESH_COOKIE_PATH,
    });
  }
}