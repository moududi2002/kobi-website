//apps/api/src/modules/contact/dto/contact.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreateContactMessageDto {
  @ApiProperty({ example: 'রহিম উদ্দিন' })
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: 'rahim@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ example: 'কবিতা সম্পর্কে জিজ্ঞাসা' })
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  subject: string;

  @ApiProperty({ example: 'আসসালামু আলাইকুম...' })
  @IsString()
  @MinLength(10)
  @MaxLength(5000)
  message: string;

  // Simple honeypot — should remain empty (bots fill it)
  @ApiPropertyOptional({ description: 'Honeypot — leave empty' })
  @IsOptional()
  @IsString()
  website?: string;
}

export class ContactMessageQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ['new', 'read', 'replied', 'archived'] })
  @IsOptional()
  @IsEnum(['new', 'read', 'replied', 'archived'])
  status?: 'new' | 'read' | 'replied' | 'archived';
}

export class UpdateContactMessageStatusDto {
  @ApiProperty({ enum: ['new', 'read', 'replied', 'archived'] })
  @IsEnum(['new', 'read', 'replied', 'archived'])
  status: 'new' | 'read' | 'replied' | 'archived';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  adminNote?: string;
}