import { IsString, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกหัวข้อ Blog' })
  @MaxLength(255)
  title: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;
}