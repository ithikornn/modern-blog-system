import {
  Controller, Get, Post, Patch, Delete, Param, Query,
  Body, UseGuards, UseInterceptors, UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const imageStorage = diskStorage({
  destination: './uploads',
  filename: (_, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${extname(file.originalname)}`);
  },
});

@Controller()
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  // ─── Public ──────────────────────────────────────────────

  @Get('blogs')
  findAll(@Query() query: QueryBlogDto) {
    return this.blogsService.findAll(query);
  }

  @Get('blogs/:slug')
  findOne(@Param('slug') slug: string) {
    return this.blogsService.findBySlug(slug);
  }

  // ─── Admin ───────────────────────────────────────────────

  @UseGuards(JwtAuthGuard)
  @Get('admin/blogs')
  adminFindAll() {
    return this.blogsService.adminFindAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/blogs/:id')
  adminFindOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.adminFindOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/blogs')
  @UseInterceptors(FilesInterceptor('images', 6, { storage: imageStorage }))
  create(
    @Body() dto: CreateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.blogsService.create(dto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/blogs/:id')
  @UseInterceptors(FilesInterceptor('images', 6, { storage: imageStorage }))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.blogsService.update(id, dto, files);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('admin/blogs/:id/toggle-publish')
  togglePublish(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.togglePublish(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/blogs/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.blogsService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/blogs/:blogId/images/:imageId')
  removeImage(
    @Param('blogId', ParseIntPipe) blogId: number,
    @Param('imageId', ParseIntPipe) imageId: number,
  ) {
    return this.blogsService.removeImage(blogId, imageId);
  }
}