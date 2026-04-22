import { Test, TestingModule } from '@nestjs/testing';
import { BlogsService } from './blogs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { BlogImage } from '../images/entities/blog-image.entity';
import { NotFoundException } from '@nestjs/common';
import { describe, beforeEach, afterEach, it } from 'node:test';

// Mock Repository
const mockBlogRepo = {
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  increment: jest.fn(),
  count: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockImageRepo = {
  create: jest.fn(),
  save: jest.fn(),
  count: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
};

describe('BlogsService', () => {
  let service: BlogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlogsService,
        { provide: getRepositoryToken(Blog), useValue: mockBlogRepo },
        { provide: getRepositoryToken(BlogImage), useValue: mockImageRepo },
      ],
    }).compile();

    service = module.get<BlogsService>(BlogsService);
  });

  // reset mock ทุก test
  afterEach(() => jest.clearAllMocks());

  // ─── generateUniqueSlug ───────────────────────────────
  describe('generateUniqueSlug', () => {
    it('should generate slug from english title', async () => {
      mockBlogRepo.findOneBy.mockResolvedValue(null); // ไม่มี conflict

      const slug = await service.generateUniqueSlug('Hello World');
      expect(slug).toBe('hello-world');
    });

    it('should generate slug with timestamp for thai title', async () => {
      mockBlogRepo.findOneBy.mockResolvedValue(null);

      const slug = await service.generateUniqueSlug('สวัสดี');
      expect(slug).toMatch(/^blog-\d+$/);
    });

    it('should append number if slug already exists', async () => {
      // ครั้งแรก slug ซ้ำ → ครั้งสองไม่ซ้ำ
      mockBlogRepo.findOneBy
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce(null);

      const slug = await service.generateUniqueSlug('Hello World');
      expect(slug).toBe('hello-world-2');
    });
  });

  // ─── findBySlug ───────────────────────────────────────
  describe('findBySlug', () => {
    it('should return blog and increment viewCount', async () => {
      const mockBlog = {
        id: 1,
        slug: 'test-blog',
        isPublished: true,
        viewCount: 5,
        comments: [],
        images: [],
      };

      mockBlogRepo.findOne.mockResolvedValue(mockBlog);
      mockBlogRepo.increment.mockResolvedValue(undefined);

      const result = await service.findBySlug('test-blog');

      expect(mockBlogRepo.increment).toHaveBeenCalledWith(
        { id: 1 }, 'viewCount', 1,
      );
      expect(result.viewCount).toBe(6);
    });

    it('should throw NotFoundException if blog not found', async () => {
      mockBlogRepo.findOne.mockResolvedValue(null);

      await expect(service.findBySlug('not-exist'))
        .rejects.toThrow(NotFoundException);
    });

    it('should filter only approved comments', async () => {
      const mockBlog = {
        id: 1,
        slug: 'test-blog',
        isPublished: true,
        viewCount: 0,
        images: [],
        comments: [
          { id: 1, status: 'approved' },
          { id: 2, status: 'pending' },
          { id: 3, status: 'rejected' },
        ],
      };

      mockBlogRepo.findOne.mockResolvedValue(mockBlog);
      mockBlogRepo.increment.mockResolvedValue(undefined);

      const result = await service.findBySlug('test-blog');

      expect(result.comments).toHaveLength(1);
      expect(result.comments[0].status).toBe('approved');
    });
  });

  // ─── togglePublish ────────────────────────────────────
  describe('togglePublish', () => {
    it('should publish a draft blog', async () => {
      const mockBlog = { id: 1, isPublished: false, publishedAt: null, images: [], comments: [] };
      mockBlogRepo.findOne.mockResolvedValue(mockBlog);
      mockBlogRepo.save.mockResolvedValue({ ...mockBlog, isPublished: true });

      const result = await service.togglePublish(1);

      expect(result.isPublished).toBe(true);
    });

    it('should unpublish a published blog', async () => {
      const mockBlog = { id: 1, isPublished: true, publishedAt: new Date(), images: [], comments: [] };
      mockBlogRepo.findOne.mockResolvedValue(mockBlog);
      mockBlogRepo.save.mockResolvedValue({ ...mockBlog, isPublished: false, publishedAt: null });

      const result = await service.togglePublish(1);

      expect(result.isPublished).toBe(false);
      expect(result.publishedAt).toBeNull();
    });
  });
});