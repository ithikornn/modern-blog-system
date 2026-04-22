import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment, CommentStatus } from './entities/comment.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentStatusDto } from './dto/update-comment-status.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
  ) {}

  async create(blogId: number, dto: CreateCommentDto) {
    const blog = await this.blogRepo.findOneBy({ id: blogId, isPublished: true });
    if (!blog) throw new NotFoundException('ไม่พบบทความ');

    const comment = this.commentRepo.create({
      blog,
      authorName: dto.authorName,
      body: dto.body,
      status: CommentStatus.PENDING,
    });

    const saved = await this.commentRepo.save(comment);

    return {
      id: saved.id,
      authorName: saved.authorName,
      status: saved.status,
      message: 'ส่งความคิดเห็นสำเร็จ รอการอนุมัติจาก Admin',
    };
  }

  // ─── Admin ───────────────────────────────────────────────

  async findAll(status?: CommentStatus) {
    const qb = this.commentRepo
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.blog', 'blog')
      .orderBy('comment.createdAt', 'ASC');

    if (status) {
      qb.where('comment.status = :status', { status });
    }

    return qb.getMany();
  }

  async updateStatus(id: number, dto: UpdateCommentStatusDto) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('ไม่พบ Comment');

    comment.status = dto.status;
    return this.commentRepo.save(comment);
  }

  async remove(id: number) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment) throw new NotFoundException('ไม่พบ Comment');
    await this.commentRepo.remove(comment);
    return { message: 'ลบ Comment สำเร็จ' };
  }
}