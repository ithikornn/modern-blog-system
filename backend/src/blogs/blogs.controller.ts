import {
  Controller, Get, Post, Patch, Delete, Param, Query,
  Body, UseGuards, UseInterceptors, UploadedFiles,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { BlogsService } from './blogs.service';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { QueryBlogDto } from './dto/query-blog.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
 
const imageStorage = diskStorage({
  destination: './uploads',
  filename: (_, file, cb) => {
    // ใช้ extension จาก MIME type จริง ไม่ใช่จากชื่อไฟล์
    const mimeToExt: Record<string, string> = {
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/webp': '.webp',
    };
    const ext = mimeToExt[file.mimetype] ?? '.bin';
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${ext}`);
  },
});
 
function imageFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile: boolean) => void,
) {
  if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
    return cb(
      new BadRequestException(
        `ไฟล์ "${file.originalname}" ต้องเป็น JPG, PNG หรือ WebP เท่านั้น`,
      ),
      false,
    );
  }
  cb(null, true);
}
 
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
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      storage: imageStorage,
      fileFilter: imageFileFilter,     // FIX: MIME validation
      limits: { fileSize: MAX_FILE_SIZE_BYTES }, // FIX: size limit
    }),
  )
  create(
    @Body() dto: CreateBlogDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.blogsService.create(dto, files);
  }
 
  @UseGuards(JwtAuthGuard)
  @Patch('admin/blogs/:id')
  @UseInterceptors(
    FilesInterceptor('images', 6, {
      storage: imageStorage,
      fileFilter: imageFileFilter,     // FIX: MIME validation
      limits: { fileSize: MAX_FILE_SIZE_BYTES },
    }),
  )
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