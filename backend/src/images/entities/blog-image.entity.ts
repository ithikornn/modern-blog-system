import { Blog } from "../../blogs/entities/blog.entity";
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from "typeorm";

@Entity('blog_images')
export class BlogImage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Blog, (blog) => blog.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @Column()
  url: string;

  @Column({ name: 'sort_order', default: 0 })
  sortOrder: number;
}