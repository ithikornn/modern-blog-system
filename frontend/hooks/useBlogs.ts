import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Blog, BlogListResponse } from '@/types/blog';

export function useBlogs(search: string, page: number) {
  const [data, setData] = useState<Blog[]>([]);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    api.get<BlogListResponse>('/blogs', { params: { search, page } })
      .then(res => {
        setData(res.data.data);
        setLastPage(res.data.meta.lastPage);
        setTotal(res.data.meta.total);
      })
      .catch(() => setError('ไม่สามารถโหลดบทความได้'))
      .finally(() => setLoading(false));

  }, [search, page]); // รันใหม่ทุกครั้งที่ search หรือ page เปลี่ยน

  return { data, lastPage, total, loading, error };
}