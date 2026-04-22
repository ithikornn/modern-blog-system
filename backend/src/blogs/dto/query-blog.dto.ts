import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class QueryBlogDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;
}