import {
    Controller, Get, Post, Patch, Delete,
    Param, Query, Body, UseGuards, ParseIntPipe,
  } from '@nestjs/common';
  import { CommentsService } from './comments.service';
  import { CreateCommentDto } from './dto/create-comment.dto';
  import { UpdateCommentStatusDto } from './dto/update-comment-status.dto';
  import { CommentStatus } from './entities/comment.entity';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller()
  export class CommentsController {
    constructor(private readonly commentsService: CommentsService) {}
  
    // ─── Public ──────────────────────────────────────────────
  
    @Post('blogs/:id/comments')
    create(
      @Param('id', ParseIntPipe) blogId: number,
      @Body() dto: CreateCommentDto,
    ) {
      return this.commentsService.create(blogId, dto);
    }
  
    // ─── Admin ───────────────────────────────────────────────
  
    @UseGuards(JwtAuthGuard)
    @Get('admin/comments')
    findAll(@Query('status') status?: CommentStatus) {
      return this.commentsService.findAll(status);
    }
  
    @UseGuards(JwtAuthGuard)
    @Patch('admin/comments/:id')
    updateStatus(
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateCommentStatusDto,
    ) {
      return this.commentsService.updateStatus(id, dto);
    }
  
    @UseGuards(JwtAuthGuard)
    @Delete('admin/comments/:id')
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.commentsService.remove(id);
    }
  }