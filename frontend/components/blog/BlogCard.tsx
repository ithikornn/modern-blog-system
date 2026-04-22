import Link from 'next/link';
import Image from 'next/image';
import { Blog } from '@/types/blog';

interface Props {
  blog: Blog;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogCard({ blog }: Props) {
  const cover = blog.images?.[0];
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      {/* Cover image */}
      <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
        {cover ? (
          <img
            src={`${apiBaseUrl}${cover.url}`}
            alt={blog.title}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-slate-100 to-slate-200">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <h2 className="font-semibold text-slate-800 text-base leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {blog.title}
        </h2>

        {blog.summary && (
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4 flex-1">
            {blog.summary}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-3 border-t border-slate-50">
          <span>{formatDate(blog.publishedAt ?? blog.createdAt)}</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {blog.viewCount.toLocaleString()}
          </span>
        </div>
      </div>
    </Link>
  );
}