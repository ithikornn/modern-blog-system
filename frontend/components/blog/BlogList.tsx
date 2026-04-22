'use client';
import { useBlogs } from '@/hooks/useBlogs';
import BlogCard from './BlogCard';
import Pagination from '@/components/ui/Pagination';

interface Props {
  search: string;
  page: number;
  onPageChange: (page: number) => void;
}

export default function BlogList({ search, page, onPageChange }: Props) {
  const { data, lastPage, total, loading, error } = useBlogs(search, page);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="aspect-video bg-slate-100" />
            <div className="p-5 space-y-3">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-3 bg-slate-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 text-center py-16 text-slate-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
        <p>{error}</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="mt-10 text-center py-16 text-slate-400">
        <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm">ไม่พบบทความ{search ? `สำหรับ "${search}"` : ''}</p>
      </div>
    );
  }

  return (
    <>
      {/* Result count */}
      <p className="text-sm text-slate-400 mt-6 mb-4">
        พบ <span className="font-medium text-slate-600">{total}</span> บทความ
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {data.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </div>

      <Pagination page={page} lastPage={lastPage} onChange={onPageChange} />
    </>
  );
}