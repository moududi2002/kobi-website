import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCategoryDto {
  @ApiProperty({ example: 'হামদ' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'Hamd' })
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  nameEn: string;

  @ApiPropertyOptional({ example: 'hamd' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  slug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ enum: ['poem', 'lyric'] })
  @IsEnum(['poem', 'lyric'])
  type: 'poem' | 'lyric';

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CategoryQueryDto {
  @ApiPropertyOptional({ enum: ['poem', 'lyric'] })
  @IsOptional()
  @IsEnum(['poem', 'lyric'])
  type?: 'poem' | 'lyric';
}