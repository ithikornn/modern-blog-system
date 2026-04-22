import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from './entities/blog.entity';
import { BlogImage } from '../images/entities/blog-image.entity';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';

const PAGE_SIZE = 10;
const MAX_IMAGES = 6;

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogRepo: Repository<Blog>,
    @InjectRepository(BlogImage)
    private readonly imageRepo: Repository<BlogImage>,
  ) {}

  // ─── Public ──────────────────────────────────────────────

  async findAll(query: QueryBlogDto) {
    const page = Math.max(1, parseInt(query.page ?? '1'));
    const skip = (page - 1) * PAGE_SIZE;

    const qb = this.blogRepo
      .createQueryBuilder('blog')
      .leftJoinAndSelect('blog.images', 'images')
      .where('blog.isPublished = :pub', { pub: true })
      .orderBy('blog.publishedAt', 'DESC')
      .take(PAGE_SIZE)
      .skip(skip);

    if (query.search?.trim()) {
      qb.andWhere('blog.title ILIKE :search', {
        search: `%${query.search.trim()}%`,
      });
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / PAGE_SIZE),
      },
    };
  }

  async findBySlug(slug: string) {
    const blog = await this.blogRepo.findOne({
      where: { slug, isPublished: true },
      relations: ['images', 'comments'],
    });
    if (!blog) throw new NotFoundException('ไม่พบบทความนี้');

    // filter เฉพาะ comment ที่ approved
    blog.comments = blog.comments.filter((c) => c.status === 'approved');

    await this.blogRepo.increment({ id: blog.id }, 'viewCount', 1);
    blog.viewCount += 1;

    return blog;
  }

  // ─── Admin ───────────────────────────────────────────────

  async adminFindAll() {
    return this.blogRepo.find({
      relations: ['images'],
      order: { createdAt: 'DESC' },
    });
  }

  async adminFindOne(id: number) {
    const blog = await this.blogRepo.findOne({
      where: { id },
      relations: ['images', 'comments'],
    });
    if (!blog) throw new NotFoundException('ไม่พบบทความ');
    return blog;
  }

  async create(dto: CreateBlogDto, files: Express.Multer.File[]) {
    const slug = await this.generateUniqueSlug(dto.title);

    const blog = this.blogRepo.create({ ...dto, slug, isPublished: false });
    const saved = await this.blogRepo.save(blog);

    await this.saveImages(saved, files);

    return this.adminFindOne(saved.id);
  }

  async update(id: number, dto: UpdateBlogDto, files?: Express.Multer.File[]) {
    const blog = await this.adminFindOne(id);

    if (dto.slug && dto.slug !== blog.slug) {
      dto.slug = await this.generateUniqueSlug(dto.slug);
    }

    Object.assign(blog, dto);
    const saved = await this.blogRepo.save(blog);

    if (files?.length) {
      // ตรวจจำนวนรูปที่มีอยู่ + รูปใหม่
      const currentCount = blog.images?.length ?? 0;
      const remaining = MAX_IMAGES - currentCount;

      if (remaining <= 0) {
        throw new BadRequestException(`มีรูปครบ ${MAX_IMAGES} รูปแล้ว กรุณาลบรูปเก่าก่อน`);
      }

      await this.saveImages(saved, files.slice(0, remaining));
    }

    return this.adminFindOne(saved.id);
  }

  async togglePublish(id: number) {
    const blog = await this.adminFindOne(id);
    blog.isPublished = !blog.isPublished;
    blog.publishedAt = blog.isPublished ? new Date() : new Date(0);
    return this.blogRepo.save(blog);
  }

  async remove(id: number) {
    const blog = await this.adminFindOne(id);
    await this.blogRepo.remove(blog);
    return { message: 'ลบบทความสำเร็จ' };
  }

  async removeImage(blogId: number, imageId: number) {
    const image = await this.imageRepo.findOne({
      where: { id: imageId, blog: { id: blogId } },
    });
    if (!image) throw new NotFoundException('ไม่พบรูปภาพ');
    await this.imageRepo.remove(image);
    return { message: 'ลบรูปภาพสำเร็จ' };
  }

  // ─── Helpers ─────────────────────────────────────────────

  private async saveImages(blog: Blog, files: Express.Multer.File[]) {
    if (!files?.length) return;

    const currentCount = await this.imageRepo.count({
      where: { blog: { id: blog.id } },
    });

    const entities = files.slice(0, MAX_IMAGES - currentCount).map((file, i) =>
      this.imageRepo.create({
        blog,
        url: `/uploads/${file.filename}`,
        sortOrder: currentCount + i,
      }),
    );

    await this.imageRepo.save(entities);
  }

  async generateUniqueSlug(title: string): Promise<string> {
    const isEnglish = /[a-zA-Z]/.test(title);
    let base = isEnglish
      ? title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : `blog-${Date.now()}`;

    let slug = base;
    let count = 1;
    while (await this.blogRepo.findOneBy({ slug })) {
      slug = `${base}-${++count}`;
    }
    return slug;
  }
}