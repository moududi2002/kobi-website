// apps\api\src\modules\poems\dto\poem.dto.ts
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
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

import { PaginationDto } from '../../../common/dto/pagination.dto';

export class CreatePoemDto {
  @ApiProperty({ example: 'বৃষ্টির দিনে' })
  @IsString()
  @MinLength(1)
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional({ description: 'Auto-generated from title if omitted' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({ description: 'TipTap HTML' })
  @IsString()
  @MinLength(1)
  content: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  coverImage?: string;

  @ApiPropertyOptional({ description: 'Category ObjectId' })
  @IsOptional()
  @IsMongoId()
  category?: string;

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

export class UpdatePoemDto extends PartialType(CreatePoemDto) {}

export class PoemQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ['draft', 'published', 'archived'] })
  @IsOptional()
  @IsEnum(['draft', 'published', 'archived'])
  status?: 'draft' | 'published' | 'archived';

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
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

export class UpdatePoemStatusDto {
  @ApiProperty({ enum: ['draft', 'published', 'archived'] })
  @IsEnum(['draft', 'published', 'archived'])
  status: 'draft' | 'published' | 'archived';
}

export class UpdatePoemFeaturedDto {
  @ApiProperty()
  @Type(() => Boolean)
  @IsBoolean()
  featured: boolean;
}