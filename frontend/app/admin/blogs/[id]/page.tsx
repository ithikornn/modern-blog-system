'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Blog } from '@/types/blog';
import BlogForm from '@/components/admin/BlogForm';

interface Props {
  params: Promise<{ id: string }>;
}

export default function EditBlogPage({ params }: Props) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      const { id } = await params;
      try {
        const res = await api.get<Blog>(`/admin/blogs/${id}`);
        setBlog(res.data);
      } catch {
        setError('ไม่พบบทความ');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params]);
  if (loading) {
    return (
      <div className="max-w-2xl animate-pulse space-y-4">
        <div className="h-8 bg-slate-100 rounded w-1/3" />
        <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-slate-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="mb-4">{error}</p>
        <Link href="/admin/blogs" className="text-blue-500 hover:underline text-sm">
          ← กลับหน้ารายการ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/blogs"
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">แก้ไขบทความ</h1>
          <p className="text-sm text-slate-400 mt-0.5 font-mono">{blog.slug}</p>
        </div>
        {/* View link */}
        {blog.isPublished && (
          <Link
            href={`/blog/${blog.slug}`}
            target="_blank"
            className="ml-auto flex items-center gap-1.5 text-sm text-slate-400 hover:text-blue-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            ดูบทความ
          </Link>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <BlogForm blog={blog} />
      </div>
    </div>
  );
}