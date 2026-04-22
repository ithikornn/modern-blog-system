import { IsString, IsOptional, IsBoolean, IsInt, IsDateString, MaxLength } from 'class-validator';

export class UpdateBlogDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @IsOptional()
  @IsInt()
  viewCount?: number;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;
}