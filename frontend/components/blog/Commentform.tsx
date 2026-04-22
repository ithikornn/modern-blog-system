'use client';
import { useState } from 'react';
import api from '@/lib/api';
import { validateAuthorName, validateThaiText, hasErrors } from '@/lib/validators';

interface Props {
  blogId: number;
}

export default function CommentForm({ blogId }: Props) {
  const [form, setForm] = useState({ authorName: '', body: '' });
  const [errors, setErrors] = useState({ authorName: '', body: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      authorName: validateAuthorName(form.authorName),
      body: validateThaiText(form.body),
    };
    setErrors(newErrors);
    if (hasErrors(newErrors)) return;

    setLoading(true);
    try {
      await api.post(`/blogs/${blogId}/comments`, form);
      setSuccess(true);
      setForm({ authorName: '', body: '' });
    } catch {
      setErrors((prev) => ({ ...prev, body: 'ส่งความคิดเห็นไม่สำเร็จ กรุณาลองใหม่' }));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-medium text-green-800 mb-1">ส่งความคิดเห็นสำเร็จ</p>
        <p className="text-sm text-green-600">ความคิดเห็นของคุณรอการอนุมัติจาก Admin</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-700 hover:underline"
        >
          แสดงความคิดเห็นอีกครั้ง
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-2xl p-6">
      <h3 className="font-semibold text-slate-800 mb-5 text-lg">แสดงความคิดเห็น</h3>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Author name */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            ชื่อผู้ส่ง <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            placeholder="กรอกชื่อของคุณ"
            value={form.authorName}
            onChange={(e) => setForm({ ...form, authorName: e.target.value })}
            className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.authorName
                ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400'
                : 'border-slate-200 focus:ring-blue-400/20 focus:border-blue-400'
            }`}
          />
          {errors.authorName && (
            <p className="text-xs text-red-500 mt-1">{errors.authorName}</p>
          )}
        </div>

        {/* Body */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1.5">
            ความคิดเห็น <span className="text-red-400">*</span>
            <span className="font-normal text-slate-400 ml-1">(ภาษาไทยและตัวเลขเท่านั้น)</span>
          </label>
          <textarea
            placeholder="กรอกความคิดเห็นเป็นภาษาไทย..."
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={4}
            className={`w-full px-4 py-2.5 bg-white border rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.body
                ? 'border-red-300 focus:ring-red-400/20 focus:border-red-400'
                : 'border-slate-200 focus:ring-blue-400/20 focus:border-blue-400'
            }`}
          />
          {errors.body && (
            <p className="text-xs text-red-500 mt-1">{errors.body}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-md flex items-center gap-2"
        >
          {loading && (
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {loading ? 'กำลังส่ง...' : 'ส่งความคิดเห็น'}
        </button>
      </form>
    </div>
  );
}