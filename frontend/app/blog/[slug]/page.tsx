import BlogContent from '@/components/blog/Blogcontent';
import CommentForm from '@/components/blog/Commentform';
import CommentList from '@/components/blog/Commentlist';
import api from '@/lib/api';
import { Blog } from '@/types/blog';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await api.get<Blog>(`/blogs/${slug}`);
    return res.data;
  } catch {
    return null;
  }
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug); // ← fetch ที่เดียว นับแค่ครั้งเดียว

  if (!blog) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-10 text-center text-slate-400">
        <p className="text-5xl mb-4">404</p>
        <p>ไม่พบบทความที่ต้องการ</p>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <BlogContent blog={blog} />  {/* ← ส่ง blog ตรงๆ ไม่ต้อง fetch ใหม่ */}
      <div className="my-10 border-t border-slate-100" />
      <CommentForm blogId={blog.id} />
      <CommentList comments={blog.comments ?? []} />
    </main>
  );
}