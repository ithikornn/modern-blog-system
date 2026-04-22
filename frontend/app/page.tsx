'use client';
import { useState } from 'react';
import BlogList from '@/components/blog/BlogList';
import SearchBar from '@/components/ui/SearchBar';
import { useDebounce } from '@/hooks/useDebounce';

export default function Home() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 500); // ← รอ 500ms หลังพิมพ์หยุด
  

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2">บทความทั้งหมด</h1>
        <p className="text-slate-400 text-base">อ่านบทความและความรู้ต่างๆ</p>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={handleSearch} />

      {/* Blog list */}
      <BlogList search={debouncedSearch} page={page} onPageChange={setPage} />
    </main>
  );
}