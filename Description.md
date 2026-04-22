# Blog Management System — Assignment A

ระบบจัดการบทความครบวงจร พร้อม Admin Panel สำหรับจัดการบทความและความคิดเห็น  
ทำครบทั้ง **Frontend + Backend** ตามข้อกำหนดทุกข้อ

---

## ✅ Feature Coverage

| ข้อกำหนด | สถานะ | รายละเอียด |
|---|---|---|
| **หน้ารวม Blog** — แสดงรายการพร้อมรูป ชื่อ เนื้อหาย่อ วันที่โพสต์ | ✅ | `GET /blogs` + pagination |
| **หน้ารวม Blog** — ค้นหาจากชื่อได้ | ✅ | query param `?search=` + `ILIKE` |
| **หน้ารวม Blog** — Pagination 10 รายการ/หน้า | ✅ | query param `?page=` |
| **หน้ารายละเอียด** — รูปภาพสูงสุด 6 รูป | ✅ | `blog_images` table + Multer limit |
| **หน้ารายละเอียด** — ชื่อ วันที่โพสต์ เนื้อหาเต็ม จำนวนผู้เข้าชม | ✅ | `view_count` increment ทุก request |
| **Comment** — กรอกชื่อผู้ส่ง | ✅ | `author_name` field |
| **Comment** — ข้อความต้องเป็นภาษาไทยและตัวเลขเท่านั้น | ✅ | Custom validator `IsThaiText` (regex `/^[\u0E00-\u0E7F...]+$/`) |
| **Comment** — ต้องรอ approve ก่อนแสดง | ✅ | `status: pending/approved/rejected` |
| **Admin** — แก้ไขข้อมูลบทความทุกอย่าง ยกเว้นวันที่โพสต์และจำนวนผู้เข้าชม | ✅ | `PATCH /admin/blogs/:id` |
| **Admin** — Publish / Unpublish | ✅ | `PATCH /admin/blogs/:id/toggle-publish` |
| **Admin** — แก้ไข URL Slug | ✅ | field `slug` ใน UpdateBlogDto |
| **Admin** — ดูรายการ comment และ approve/reject | ✅ | `GET/PATCH /admin/comments` |
| **Admin** — ต้อง login ก่อนใช้งาน | ✅ | JWT Bearer Token + `JwtAuthGuard` |
| **Database schema** | ✅ | ดูหัวข้อ Database Schema ด้านล่าง |

---

## 🏗 Tech Stack

### Backend
| เทคโนโลยี | เวอร์ชัน | เหตุผลที่เลือก |
|---|---|---|
| **NestJS** | 11 | Modular architecture, Dependency Injection, decorator-based routing เหมาะกับโปรเจคที่ต้องการความชัดเจนของโครงสร้าง |
| **TypeORM** | 0.3 | ORM ที่ทำงานได้ดีกับ NestJS, type-safe, รองรับ PostgreSQL ครบถ้วน |
| **PostgreSQL** | 16 | Relational DB รองรับ `ILIKE` สำหรับ full-text search ภาษาไทย และ `ENUM` type |
| **Passport.js + JWT** | — | Stateless authentication เหมาะกับ REST API ที่มี frontend แยก domain |
| **Multer** | 2 | File upload middleware ที่ built-in กับ NestJS รองรับ `diskStorage` |
| **bcryptjs** | 3 | Password hashing |
| **class-validator** | 0.15 | DTO validation แบบ decorator-based รวม custom validator สำหรับภาษาไทย |
| **Helmet** | 8 | Security headers (XSS, clickjacking, MIME sniffing) |
| **@nestjs/throttler** | 6 | Rate limiting ป้องกัน brute force และ comment spam |
| **Docker + Docker Compose** | — | จัดการ PostgreSQL ได้สะดวก ไม่ต้องติดตั้ง DB บนเครื่องโดยตรง |

### Frontend
| เทคโนโลยี | เวอร์ชัน | เหตุผลที่เลือก |
|---|---|---|
| **Next.js** | 16 | SSR/SSG, App Router, built-in routing ครอบคลุมทั้ง public และ admin pages |
| **Tailwind CSS** | 4 | Utility-first, ไม่ต้องจัดการ CSS file แยก |
| **Axios** | 1.15 | HTTP client ที่จัดการ interceptor (auth header, 401 redirect) ได้สะดวก |
| **react-markdown + remark-gfm** | — | Render Markdown content รองรับ table, link, code block |

---

## 🗄 Database Schema

```
blogs ──< blog_images   (one-to-many, CASCADE DELETE)
blogs ──< comments      (one-to-many, CASCADE DELETE)
```

### blogs
| Column | Type | คำอธิบาย |
|---|---|---|
| id | integer PK | Auto increment |
| title | varchar(255) | หัวข้อบทความ |
| slug | varchar UNIQUE | URL-friendly identifier เช่น `my-first-post` |
| summary | text nullable | สรุปย่อ แสดงในหน้ารายการ |
| content | text nullable | เนื้อหาเต็ม (Markdown) |
| is_published | boolean | สถานะ publish (default: false) |
| view_count | integer | จำนวนผู้เข้าชม (default: 0) |
| published_at | timestamp nullable | วันเวลาที่ publish |
| created_at | timestamp | Auto |
| updated_at | timestamp | Auto |

### blog_images
| Column | Type | คำอธิบาย |
|---|---|---|
| id | integer PK | |
| blog_id | integer FK | → blogs.id, CASCADE DELETE |
| url | varchar | path เช่น `/uploads/1234567890-123.jpg` |
| sort_order | integer | ลำดับการแสดงผล (default: 0) |

### comments
| Column | Type | คำอธิบาย |
|---|---|---|
| id | integer PK | |
| blog_id | integer FK | → blogs.id, CASCADE DELETE |
| author_name | varchar(100) | ชื่อผู้ส่ง |
| body | text | เนื้อหา comment (ภาษาไทย + ตัวเลขเท่านั้น) |
| status | enum | `pending` / `approved` / `rejected` (default: pending) |
| created_at | timestamp | Auto |

> DBML สำหรับ dbdiagram.io อยู่ที่ไฟล์ `dbdiagram.dbml`

---

## 📐 Assumptions & Design Decisions

### Authentication
- ระบบมี Admin เพียง 1 คน เพราะโจทย์ไม่ได้ระบุว่าต้องมีหลาย admin  
  → เก็บ credential ไว้ใน environment variable แทนการสร้าง `admins` table
- JWT token อายุ 7 วัน เหมาะสำหรับ internal tool ที่ใช้งานต่อเนื่อง

### Blog
- **Slug generation**: ถ้า title เป็นภาษาอังกฤษจะ generate slug จาก title อัตโนมัติ  
  ถ้าเป็นภาษาไทยจะใช้ `blog-{timestamp}` เพราะไม่สามารถ romanize ภาษาไทยได้โดยไม่ใช้ external library  
  Admin สามารถแก้ slug เองได้ในภายหลัง
- **view_count**: นับทุกครั้งที่มีการเรียก `GET /blogs/:slug` โดยไม่ filter bot หรือ duplicate IP เพราะอยู่นอก scope ของโจทย์
- **isPublished = false** เสมอตอนสร้างใหม่ → Admin ต้อง publish เองเพื่อป้องกัน draft หลุดออกสู่สาธารณะ
- บทความที่ unpublish (`publishedAt` จะถูก reset เป็น `epoch 0` เพื่อให้ sort ไม่ขึ้นมาก่อน) 

### Comment
- Comment ใหม่มี status = `pending` เสมอ ไม่แสดงให้ผู้อ่านเห็นจนกว่า admin จะ approve
- **Thai text validation** ทำทั้งฝั่ง frontend (UX) และ backend (DTO) เพื่อความปลอดภัย  
  regex: `/^[\u0E00-\u0E7F0-9\u0E50-\u0E59\s]+$/`  
  ยอมรับ: ภาษาไทย, ตัวเลขอารบิก (0-9), เลขไทย (๐-๙), และ whitespace

### File Upload
- รองรับเฉพาะ `image/jpeg`, `image/png`, `image/webp` ตรวจจาก MIME type จริง (ไม่ใช่ extension)  
- จำกัดขนาดไฟล์ 5 MB ต่อรูป สูงสุด 6 รูปต่อบทความ
- ไฟล์ถูก serve เป็น static asset ที่ `/uploads/` โดยตรง

### ส่วนที่ทำเพิ่มนอกข้อกำหนด (Bonus)
- Rate limiting: login 10 ครั้ง/นาที, comment 5 ครั้ง/นาที
- Security headers ด้วย Helmet
- Global ValidationPipe (`whitelist: true`, `forbidNonWhitelisted: true`)
