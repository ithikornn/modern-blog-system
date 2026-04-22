import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogsModule } from './blogs/blogs.module';
import { CommentsModule } from './comments/comments.module';
import { AuthModule } from './auth/auth.module';
import { Blog } from './blogs/entities/blog.entity';
import { BlogImage } from './images/entities/blog-image.entity';
import { Comment } from './comments/entities/comment.entity';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
 
    // ── Rate Limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,   // window 60 วินาที
        limit: 100,    // max 100 req ต่อ IP
      },
      {
        name: 'login',
        ttl: 60_000,
        limit: 10,     // login max 10 ครั้ง/นาที → ป้องกัน brute force
      },
    ]),
 
    // ── Database ─────────────────────────────────────────────────────────────
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        entities: [Blog, BlogImage, Comment],
 
        // FIX: เปลี่ยนจาก true → false
        // ใน production ให้รัน migration แทน:
        //   npm run migration:generate -- src/migrations/InitSchema
        //   npm run migration:run
        synchronize: false,
 
        ssl: config.get('DB_SSL') === 'true'
          ? { rejectUnauthorized: false }
          : false,
        extra: {
          options: '-c timezone=Asia/Bangkok',
        },
      }),
      inject: [ConfigService],
    }),
 
    BlogsModule,
    CommentsModule,
    AuthModule,
  ],
  providers: [
    // ลงทะเบียน ThrottlerGuard เป็น Global Guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}