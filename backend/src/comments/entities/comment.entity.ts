import { Blog } from "../../blogs/entities/blog.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from "typeorm";

export enum CommentStatus {   // ← ต้องมี export
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blog, (blog) => blog.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column({ name: 'author_name', length: 100 })
  authorName: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  })
  status: 'pending' | 'approved' | 'rejected';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}