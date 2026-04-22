import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment, CommentStatus } from './entities/comment.entity';
import { Blog } from '../blogs/entities/blog.entity';
import { NotFoundException } from '@nestjs/common';
import { describe, beforeEach, afterEach, it } from 'node:test';

const mockCommentRepo = {
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockBlogRepo = {
  findOneBy: jest.fn(),
};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getRepositoryToken(Comment), useValue: mockCommentRepo },
        { provide: getRepositoryToken(Blog), useValue: mockBlogRepo },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ─── create ───────────────────────────────────────────
  describe('create', () => {
    const dto = { authorName: 'สมชาย', body: 'บทความดีมาก' };
    const mockBlog = { id: 1, isPublished: true };

    it('should create comment with pending status', async () => {
      const mockComment = { id: 1, ...dto, status: CommentStatus.PENDING };

      mockBlogRepo.findOneBy.mockResolvedValue(mockBlog);
      mockCommentRepo.create.mockReturnValue(mockComment);
      mockCommentRepo.save.mockResolvedValue(mockComment);

      const result = await service.create(1, dto);

      expect(mockCommentRepo.create).toHaveBeenCalledWith({
        blog: mockBlog,
        authorName: dto.authorName,
        body: dto.body,
        status: CommentStatus.PENDING,
      });
      expect(result.status).toBe(CommentStatus.PENDING);
    });

    it('should return success message after create', async () => {
      const mockComment = { id: 1, ...dto, status: CommentStatus.PENDING };

      mockBlogRepo.findOneBy.mockResolvedValue(mockBlog);
      mockCommentRepo.create.mockReturnValue(mockComment);
      mockCommentRepo.save.mockResolvedValue(mockComment);

      const result = await service.create(1, dto);

      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException if blog not found', async () => {
      mockBlogRepo.findOneBy.mockResolvedValue(null);

      await expect(service.create(999, dto))
        .rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if blog is unpublished', async () => {
      mockBlogRepo.findOneBy.mockResolvedValue(null); // isPublished: false → findOneBy return null

      await expect(service.create(1, dto))
        .rejects.toThrow(NotFoundException);
    });
  });

  // ─── findAll ──────────────────────────────────────────
  describe('findAll', () => {
    const mockComments = [
      { id: 1, status: CommentStatus.PENDING },
      { id: 2, status: CommentStatus.APPROVED },
      { id: 3, status: CommentStatus.PENDING },
    ];

    it('should return all comments when no status filter', async () => {
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(mockComments),
      };
      mockCommentRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.findAll();
      expect(result).toHaveLength(3);
    });

    it('should filter by status when provided', async () => {
      const pendingComments = mockComments.filter(
        (c) => c.status === CommentStatus.PENDING,
      );
      const mockQb = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(pendingComments),
      };
      mockCommentRepo.createQueryBuilder.mockReturnValue(mockQb);

      const result = await service.findAll(CommentStatus.PENDING);
      expect(result).toHaveLength(2);
      result.forEach((c) => expect(c.status).toBe(CommentStatus.PENDING));
    });
  });

  // ─── updateStatus ─────────────────────────────────────
  describe('updateStatus', () => {
    const mockComment = {
      id: 1,
      status: CommentStatus.PENDING,
      authorName: 'สมชาย',
      body: 'ดีมาก',
    };

    it('should approve a pending comment', async () => {
      mockCommentRepo.findOneBy.mockResolvedValue({ ...mockComment });
      mockCommentRepo.save.mockResolvedValue({
        ...mockComment,
        status: CommentStatus.APPROVED,
      });

      const result = await service.updateStatus(1, {
        status: CommentStatus.APPROVED,
      });

      expect(result.status).toBe(CommentStatus.APPROVED);
    });

    it('should reject a pending comment', async () => {
      mockCommentRepo.findOneBy.mockResolvedValue({ ...mockComment });
      mockCommentRepo.save.mockResolvedValue({
        ...mockComment,
        status: CommentStatus.REJECTED,
      });

      const result = await service.updateStatus(1, {
        status: CommentStatus.REJECTED,
      });

      expect(result.status).toBe(CommentStatus.REJECTED);
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentRepo.findOneBy.mockResolvedValue(null);

      await expect(
        service.updateStatus(999, { status: CommentStatus.APPROVED }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  // ─── remove ───────────────────────────────────────────
  describe('remove', () => {
    it('should remove comment successfully', async () => {
      const mockComment = { id: 1, status: CommentStatus.PENDING };
      mockCommentRepo.findOneBy.mockResolvedValue(mockComment);
      mockCommentRepo.remove.mockResolvedValue(undefined);

      const result = await service.remove(1);

      expect(mockCommentRepo.remove).toHaveBeenCalledWith(mockComment);
      expect(result.message).toBeDefined();
    });

    it('should throw NotFoundException if comment not found', async () => {
      mockCommentRepo.findOneBy.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});