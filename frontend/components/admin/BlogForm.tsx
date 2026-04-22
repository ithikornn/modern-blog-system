'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Blog, BlogImage } from '@/types/blog';
import { validateBlogTitle, validateBlogSlug } from '@/lib/validators';
import ImageUploader from './ImageUploader';

interface Props {
  blog?: Blog; // ถ้ามี = edit mode, ถ้าไม่มี = create mode
}

export default function BlogForm({ blog }: Props) {
  const router = useRouter();
  const isEdit = !!blog;

  const [form, setForm] = useState({
    title: blog?.title ?? '',
    slug: blog?.slug ?? '',
    summary: blog?.summary ?? '',
    content: blog?.content ?? '',
  });
  const [errors, setErrors] = useState({ title: '', slug: '' });
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<BlogImage[]>(blog?.images ?? []);
  const [removedImageIds, setRemovedImageIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  // Auto generate slug จาก title (เฉพาะตอนสร้างใหม่)
  const handleTitleChange = (value: string) => {
    setForm((prev) => {
      const newForm = { ...prev, title: value };
      if (!isEdit && !prev.slug) {
        const isEng = /[a-zA-Z]/.test(value);
        if (isEng) {
          newForm.slug = value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
      }
      return newForm;
    });
  };

  const handleRemoveExistingImage = async (imageId: number) => {
    if (isEdit) {
      try {
        await api.delete(`/admin/blogs/${blog!.id}/images/${imageId}`);
      } catch {
        return;
      }
    }
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    const newErrors = {
      title: validateBlogTitle(form.title),
      slug: validateBlogSlug(form.slug),
    };
    setErrors(newErrors);
    if (newErrors.title || newErrors.slug) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('slug', form.slug);
      fd.append('summary', form.summary);
      fd.append('content', form.content);
      newFiles.forEach((f) => fd.append('images', f));

      if (isEdit) {
        await api.patch(`/admin/blogs/${blog!.id}`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await api.post('/admin/blogs', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      router.push('/admin/blogs');
      router.refresh();
    } catch (err: any) {
      setApiError(err.response?.data?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {apiError && (
        <div className="bg-red-50 border border-red-200 border-l-4 border-l-red-500 px-4 py-3 rounded-lg text-sm text-red-700">
          {apiError}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          หัวข้อบทความ <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          placeholder="กรอกหัวข้อบทความ"
          value={form.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
            errors.title
              ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400'
              : 'border-slate-200 focus:ring-blue-400/20 focus:border-blue-400'
          }`}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          URL Slug <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400 whitespace-nowrap">/blog/</span>
          <input
            type="text"
            placeholder="url-slug"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className={`flex-1 px-4 py-2.5 bg-white border rounded-lg text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.slug
                ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400'
                : 'border-slate-200 focus:ring-blue-400/20 focus:border-blue-400'
            }`}
          />
        </div>
        {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug}</p>}
      </div>

      {/* Summary */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          สรุปย่อ
          <span className="font-normal text-slate-400 ml-1">(แสดงในหน้ารายการ)</span>
        </label>
        <textarea
          placeholder="สรุปเนื้อหาบทความสั้นๆ..."
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          rows={2}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all resize-none"
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          เนื้อหา
          <span className="font-normal text-slate-400 ml-1">(รองรับ Markdown)</span>
        </label>
        <textarea
          placeholder="เขียนเนื้อหาบทความ..."
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          rows={12}
          className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all resize-y"
        />
      </div>

      {/* Images */}
      <ImageUploader
        existing={existingImages}
        onAdd={(files) => setNewFiles((prev) => [...prev, ...files])}
        onRemove={handleRemoveExistingImage}
        apiUrl={process.env.NEXT_PUBLIC_API_URL ?? ''}
      />

      {/* Actions */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading ? 'กำลังบันทึก...' : isEdit ? 'บันทึกการแก้ไข' : 'สร้างบทความ'}
        </button>
      </div>
    </form>
  );
}