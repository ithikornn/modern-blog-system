import Image from 'next/image';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Blog } from '@/types/blog';

interface Props {
  blog: Blog;  // ← รับ blog มาเลย ไม่ต้อง useBlog แล้ว
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'Asia/Bangkok',
  });
}

export default function BlogContent({ blog }: Props) {
  return (
    <article>
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-6">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        กลับหน้าแรก
      </Link>

      <h1 className="text-3xl font-bold text-slate-900 leading-tight mb-4">
        {blog.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-slate-400 mb-8">
        <span>{formatDate(blog.publishedAt ?? blog.createdAt)}</span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {blog.viewCount.toLocaleString()} การเข้าชม
        </span>
      </div>

      {blog.images && blog.images.length > 0 && (
        <div className={`grid gap-3 mb-8 ${
          blog.images.length === 1 ? 'grid-cols-1' :
          blog.images.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-3'
        }`}>
          {blog.images.map((img) => (
            <div key={img.id} className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}${img.url}`}
                alt={blog.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      )}

      {blog.summary && (
        <p className="text-lg text-slate-500 leading-relaxed border-l-4 border-blue-200 pl-4 mb-8 italic">
          {blog.summary}
        </p>
      )}

      <div className="prose prose-slate max-w-none
        prose-headings:font-bold prose-headings:text-slate-800
        prose-p:text-slate-600 prose-p:leading-relaxed
        prose-li:text-slate-600
        prose-strong:text-slate-800
        prose-blockquote:border-l-blue-400 prose-blockquote:text-slate-500
        prose-table:text-sm prose-th:bg-slate-100
        prose-hr:border-slate-200"
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {blog.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}