// apps/api/src/modules/auth/dto/auth-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class AuthUserDto {
  @ApiProperty() _id: string;
  @ApiProperty() email: string;
  @ApiProperty() name: string;
  @ApiProperty({ enum: ['admin', 'editor'] }) role: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty({ required: false }) lastLoginAt?: string;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

export class LoginResponseDto {
  @ApiProperty({ type: AuthUserDto }) user: AuthUserDto;

  @ApiProperty({ description: 'JWT access token' })
  accessToken: string;

  @ApiProperty({ description: 'Access token TTL in seconds', example: 900 })
  expiresIn: number;
}

export class RefreshResponseDto {
  @ApiProperty() accessToken: string;
  @ApiProperty({ example: 900 }) expiresIn: number;
}