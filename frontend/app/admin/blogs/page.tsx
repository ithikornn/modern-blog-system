'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Blog } from '@/types/blog';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'Asia/Bangkok',
  });
}

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchBlogs = useCallback(async () => {
    try {
      const res = await api.get<Blog[]>('/admin/blogs');
      setBlogs(res.data);
    } catch {
      // handle silently
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBlogs(); }, [fetchBlogs]);

  const handleTogglePublish = async (blog: Blog) => {
    setTogglingId(blog.id);
    try {
      const res = await api.patch<Blog>(`/admin/blogs/${blog.id}/toggle-publish`);
      setBlogs((prev) => prev.map((b) => (b.id === blog.id ? res.data : b)));
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบบทความนี้?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/admin/blogs/${id}`);
      setBlogs((prev) => prev.filter((b) => b.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">บทความทั้งหมด</h1>
          <p className="text-sm text-slate-400 mt-1">{blogs.length} บทความ</p>
        </div>
        <Link
          href="/admin/blogs/create"
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          สร้างบทความ
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">ยังไม่มีบทความ</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-5 py-3.5 font-medium text-slate-500">หัวข้อ</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 hidden sm:table-cell">Slug</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 hidden md:table-cell">วันที่</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 hidden md:table-cell text-right">เข้าชม</th>
                <th className="px-5 py-3.5 font-medium text-slate-500">สถานะ</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-slate-50/50 transition-colors">
                  {/* Title */}
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800 line-clamp-1 max-w-xs">{blog.title}</p>
                  </td>

                  {/* Slug */}
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      {blog.slug}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 hidden md:table-cell text-slate-400">
                    {formatDate(blog.publishedAt ?? blog.createdAt)}
                  </td>

                  {/* Views */}
                  <td className="px-5 py-4 hidden md:table-cell text-right text-slate-400">
                    {blog.viewCount.toLocaleString()}
                  </td>

                  {/* Status toggle */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleTogglePublish(blog)}
                      disabled={togglingId === blog.id}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        blog.isPublished
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${blog.isPublished ? 'bg-green-500' : 'bg-slate-400'}`} />
                      {togglingId === blog.id ? '...' : blog.isPublished ? 'Published' : 'Draft'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/blogs/${blog.id}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="แก้ไข"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        disabled={deletingId === blog.id}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="ลบ"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}