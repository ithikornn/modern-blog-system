# Blog Management System

ระบบจัดการบทความ พร้อม Admin Panel สำหรับจัดการบทความและความคิดเห็น

## โครงสร้างโปรเจค

```
blog/
├── backend/     ← NestJS + PostgreSQL
└── frontend/    ← Next.js
```

---

## Requirements

| เครื่องมือ | เวอร์ชัน |
|-----------|---------|
| Node.js | 18+ |
| npm | 9+ |
| Docker Desktop | latest |

---

## การติดตั้งและ Run

### 1. Clone โปรเจค

```bash
git clone https://github.com/ithikornn/modern-blog-system.git
```

---

### 2. Backend

#### 2.1 ตั้งค่า Environment

```bash
cd backend
cp .env.example .env
```

แก้ไขไฟล์ `.env`

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=blog_db
DB_SSL=false

JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=7d

ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your-strong-password

PORT=5000
```

#### 2.2 เริ่ม PostgreSQL ด้วย Docker

```bash
docker compose up -d
```

ตรวจสอบว่า container รันอยู่

```bash
docker compose ps
```

ควรเห็น `blog-postgres` มีสถานะ `Up`

#### 2.3 ติดตั้ง Dependencies และ Run

```bash
npm install
npm run start:dev
```

Backend จะรันที่ `http://localhost:5000`

เมื่อ start สำเร็จจะเห็น log

```
✅ Admin "admin" created
Application is running on: http://localhost:5000
```

> **หมายเหตุ:** TypeORM จะ sync ตาราง DB ให้อัตโนมัติตอน start ไม่ต้อง migrate เอง

---

### 3. Frontend

#### 3.1 ตั้งค่า Environment

```bash
cd ../frontend
cp .env.example .env.local
```

แก้ไขไฟล์ `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

#### 3.2 ติดตั้ง Dependencies และ Run

```bash
npm install
npm run dev
```

Frontend จะรันที่ `http://localhost:3000`

---

## การใช้งาน

| หน้า | URL |
|------|-----|
| หน้าแรก (รายการบทความ) | http://localhost:3000 |
| หน้าบทความ | http://localhost:3000/blog/[slug] |
| Admin Login | http://localhost:3000/admin/login |
| Admin จัดการบทความ | http://localhost:3000/admin/blogs |
| Admin จัดการ Comment | http://localhost:3000/admin/comments |

### เข้าสู่ระบบ Admin

ใช้ username และ password ที่ตั้งไว้ใน `.env` ของ Backend

```
Username: admin
Password: your-strong-password
```

---

## Docker Compose

ไฟล์ `docker-compose.yml` ใน folder `backend`

```yaml
services:
  postgres:
    image: postgres:16
    container_name: blog-postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: blog_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### คำสั่ง Docker ที่ใช้บ่อย

```bash
# เริ่ม PostgreSQL
docker compose up -d

# หยุด PostgreSQL
docker compose down

# หยุดและลบข้อมูลทั้งหมด
docker compose down -v

# ดู logs
docker compose logs -f
```

---

## API Endpoints

### Public

| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| POST | `/auth/login` | Admin login |
| GET | `/blogs` | รายการบทความ (query: `page`, `search`) |
| GET | `/blogs/:slug` | รายละเอียดบทความ |
| POST | `/blogs/:id/comments` | ส่ง comment |

### Admin (ต้องมี Bearer Token)

| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| GET | `/admin/blogs` | บทความทั้งหมด |
| POST | `/admin/blogs` | สร้างบทความ |
| PATCH | `/admin/blogs/:id` | แก้ไขบทความ |
| PATCH | `/admin/blogs/:id/toggle-publish` | Publish / Unpublish |
| DELETE | `/admin/blogs/:id` | ลบบทความ |
| DELETE | `/admin/blogs/:blogId/images/:imageId` | ลบรูปภาพ |
| GET | `/admin/comments` | รายการ comment (query: `status`) |
| PATCH | `/admin/comments/:id` | อนุมัติ / ปฏิเสธ comment |
| DELETE | `/admin/comments/:id` | ลบ comment |

---

## Tech Stack

| ส่วน | เทคโนโลยี |
|------|----------|
| Backend | NestJS, TypeORM, PostgreSQL |
| Frontend | Next.js 15, Tailwind CSS |
| Auth | JWT (Passport.js) |
| File Upload | Multer |
| Markdown | react-markdown, remark-gfm |
| Container | Docker, Docker Compose |