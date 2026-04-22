// ─── Thai Text ────────────────────────────────────────────
// ยอมรับ: ภาษาไทย, ตัวเลข 0-9, เลขไทย ๐-๙, whitespace
const THAI_ONLY_REGEX = /^[\u0E00-\u0E7F0-9\u0E50-\u0E59\s]+$/;

export function isThaiText(value: string): boolean {
  return THAI_ONLY_REGEX.test(value.trim());
}

export function validateThaiText(value: string): string {
  if (!value.trim()) return 'กรุณากรอกข้อความ';
  if (!isThaiText(value)) return 'กรุณากรอกเฉพาะภาษาไทยและตัวเลขเท่านั้น';
  return '';
}

// ─── Author Name ──────────────────────────────────────────
export function validateAuthorName(value: string): string {
  if (!value.trim()) return 'กรุณากรอกชื่อผู้ส่ง';
  if (value.trim().length > 100) return 'ชื่อผู้ส่งต้องไม่เกิน 100 ตัวอักษร';
  return '';
}

// ─── Blog ─────────────────────────────────────────────────
export function validateBlogTitle(value: string): string {
  if (!value.trim()) return 'กรุณากรอกหัวข้อบทความ';
  if (value.trim().length > 255) return 'หัวข้อต้องไม่เกิน 255 ตัวอักษร';
  return '';
}

export function validateBlogSlug(value: string): string {
  if (!value.trim()) return 'กรุณากรอก Slug';
  if (!/^[a-z0-9-]+$/.test(value)) return 'Slug ต้องเป็นตัวเล็ก a-z, ตัวเลข และ - เท่านั้น';
  if (value.startsWith('-') || value.endsWith('-')) return 'Slug ต้องไม่ขึ้นต้นหรือลงท้ายด้วย -';
  return '';
}

// ─── Images ───────────────────────────────────────────────
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_COUNT = 6;

export function validateImages(
  newFiles: File[],
  existingCount: number = 0,
): string {
  const total = existingCount + newFiles.length;
  if (total > MAX_IMAGE_COUNT) {
    return `รูปภาพรวมกันต้องไม่เกิน ${MAX_IMAGE_COUNT} รูป (มีอยู่แล้ว ${existingCount} รูป)`;
  }
  for (const file of newFiles) {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return `ไฟล์ "${file.name}" ต้องเป็น JPG, PNG หรือ WebP เท่านั้น`;
    }
    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      return `ไฟล์ "${file.name}" ต้องมีขนาดไม่เกิน ${MAX_IMAGE_SIZE_MB} MB`;
    }
  }
  return '';
}

// ─── Login ────────────────────────────────────────────────
export function validateLogin(username: string, password: string): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!username.trim()) errors.username = 'กรุณากรอกชื่อผู้ใช้';
  if (!password.trim()) errors.password = 'กรุณากรอกรหัสผ่าน';
  return errors;
}

// ─── Utility ─────────────────────────────────────────────
// ใช้ validate หลาย field พร้อมกัน → return errors object
// hasErrors(errors) === true แสดงว่ามี error
export function hasErrors(errors: Record<string, string>): boolean {
  return Object.values(errors).some((e) => e !== '');
}