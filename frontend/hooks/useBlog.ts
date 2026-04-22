import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Blog } from '@/types/blog';

export function useBlog(slug: string) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);

    api.get<Blog>(`/blogs/${slug}`)
      .then(res => setBlog(res.data))
      .catch(() => setError('ไม่พบบทความ'))
      .finally(() => setLoading(false));

  }, [slug]);

  return { blog, loading, error };
}