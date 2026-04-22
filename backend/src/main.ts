import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
 
  // ── Security Headers ──────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-site' },
      // อนุญาต inline image จาก /uploads/ สำหรับ frontend
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
        },
      },
    }),
  );
 
  // ── Global Validation Pipe ─────────────────────────────────────────────────
  // whitelist: true  → ตัด property ที่ไม่ได้ define ใน DTO ออกอัตโนมัติ
  // forbidNonWhitelisted: true → throw error ถ้าส่ง property แปลกปลอมมา
  // transform: true  → auto-transform types (string → number ฯลฯ)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
 
  // ── Static Files (Uploads) ─────────────────────────────────────────────────
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
 
  // ── CORS ───────────────────────────────────────────────────────────────────
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
 
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
