//apps/api/src/modules/homepage/dto/homepage.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
  ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class HeroSlideDto {
  @ApiProperty({ description: 'Cloudinary image URL' })
  @IsString()
  image: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  quote?: string;
}

export class UpdateHomepageDto {
  @ApiPropertyOptional({ type: [HeroSlideDto], description: 'Max 6 slides' })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => HeroSlideDto)
  heroSlides?: HeroSlideDto[];

  @ApiPropertyOptional({ description: 'Featured poem ObjectId' })
  @IsOptional()
  @IsMongoId()
  featuredPoemId?: string;

  @ApiPropertyOptional({ description: 'Featured lyric ObjectId' })
  @IsOptional()
  @IsMongoId()
  featuredLyricId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  welcomeQuote?: string;
}