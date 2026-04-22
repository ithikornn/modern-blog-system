import Link from 'next/link';
import BlogForm from '@/components/admin/BlogForm';

export default function CreateBlogPage() {
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
          <h1 className="text-2xl font-bold text-slate-800">สร้างบทความใหม่</h1>
          <p className="text-sm text-slate-400 mt-0.5">บทความจะถูกบันทึกเป็น Draft ก่อน</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <BlogForm />
      </div>
    </div>
  );
}