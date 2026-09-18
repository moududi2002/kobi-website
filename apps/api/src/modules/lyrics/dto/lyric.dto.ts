// apps/api/src/modules/lyrics/dto/lyric.dto.ts
import {
  ApiProperty,
  ApiPropertyOptional,
  PartialType,
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsMongoId,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreateLyricDto {
  @ApiProperty({ example: 'মায়ের দুআ' })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({ description: 'TipTap HTML lyrics' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional({ description: 'YouTube URL', example: 'https://youtu.be/dQw4w9WgXcQ' })
  @IsOptional()
  @IsString()
  youtubeUrl?: string;

  @ApiProperty({ description: 'Category ObjectId' })
  @IsMongoId()
  category: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'] })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  seoDescription?: string;
}

export class UpdateLyricDto extends PartialType(CreateLyricDto) {}

export class LyricQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'] })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiPropertyOptional({ description: 'Category ObjectId or slug' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ enum: ['latest', 'oldest', 'popular'] })
  @IsOptional()
  @IsEnum(['latest', 'oldest', 'popular'])
  sort?: 'latest' | 'oldest' | 'popular';

  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsOptional()
  @IsString()
  featured?: 'true' | 'false';
}

export class UpdateLyricStatusDto {
  @ApiProperty({ enum: ['draft', 'published', 'archived'] })
  @IsEnum(['draft', 'published', 'archived'])
  status: 'draft' | 'published' | 'archived';
}

export class UpdateLyricFeaturedDto {
  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  featured: boolean;
}