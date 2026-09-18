//apps/api/src/modules/about/dto/about.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SocialLinkDto {
  @ApiProperty({ example: 'facebook' })
  @IsString()
  @MaxLength(50)
  platform: string;

  @ApiProperty({ example: 'https://facebook.com/username' })
  @IsString()
  url: string;
}

export class TimelineEntryDto {
  @ApiProperty({ example: '২০১০' })
  @IsString()
  @MaxLength(20)
  year: string;

  @ApiProperty({ example: 'প্রথম কবিতা প্রকাশ' })
  @IsString()
  @MaxLength(200)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;
}

export class UpdateAboutDto {
  @ApiPropertyOptional({ example: 'কবি ও গীতিকার...' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  shortBio?: string;

  @ApiPropertyOptional({ description: 'HTML biography from TipTap' })
  @IsOptional()
  @IsString()
  fullBio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  portraitImage?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  literaryIdentity?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiPropertyOptional({ type: [TimelineEntryDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimelineEntryDto)
  timeline?: TimelineEntryDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  contactPhone?: string;

  @ApiPropertyOptional({ type: [SocialLinkDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkDto)
  socialLinks?: SocialLinkDto[];
}