import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, 
    UpdateDateColumn, OneToMany } from 'typeorm';
import { BlogImage } from '../../images/entities/blog-image.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('blogs')
export class Blog {
@PrimaryGeneratedColumn()
id: number;

@Column({ length: 255 })
title: string;

@Column({ unique: true })
slug: string;

@Column({ type: 'text', nullable: true })
summary: string;

@Column({ type: 'text', nullable: true })
content: string;

@Column({ name: 'is_published', default: false })
isPublished: boolean;

@Column({ name: 'view_count', default: 0 })
viewCount: number;

@Column({ name: 'published_at', nullable: true })
publishedAt: Date;

@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;

@OneToMany(() => BlogImage, (image) => image.blog, { cascade: true })
images: BlogImage[];

@OneToMany(() => Comment, (comment) => comment.blog)
comments: Comment[];
}