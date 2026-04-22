import { IsEnum } from 'class-validator';
import { CommentStatus } from '../entities/comment.entity';

export class UpdateCommentStatusDto {
  @IsEnum(CommentStatus, { message: 'status ต้องเป็น approved หรือ rejected' })
  status: CommentStatus.APPROVED | CommentStatus.REJECTED;
}