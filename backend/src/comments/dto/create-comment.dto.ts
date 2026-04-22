import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { IsThaiText } from '../../commons/validators/is-thai-text.validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกชื่อผู้ส่ง' })
  @MaxLength(100)
  authorName: string;

  @IsString()
  @IsNotEmpty({ message: 'กรุณากรอกข้อความ' })
  @IsThaiText()
  body: string;
}