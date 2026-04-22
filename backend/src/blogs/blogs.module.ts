import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Blog } from './entities/blog.entity';
import { BlogImage } from '../images/entities/blog-image.entity';
import { BlogsService } from './blogs.service';
import { BlogsController } from './blogs.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Blog, BlogImage])],
  controllers: [BlogsController],
  providers: [BlogsService],
})
export class BlogsModule {}