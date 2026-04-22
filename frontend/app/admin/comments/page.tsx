'use client';
import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Comment } from '@/types/comment';

type Filter = 'pending' | 'approved' | 'rejected' | 'all';

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

const filterTabs: { key: Filter; label: string; color: string }[] = [
  { key: 'all',      label: 'ทั้งหมด',       color: 'text-slate-600' },
  { key: 'pending',  label: 'รออนุมัติ',      color: 'text-amber-600' },
  { key: 'approved', label: 'อนุมัติแล้ว',    color: 'text-green-600' },
  { key: 'rejected', label: 'ปฏิเสธแล้ว',    color: 'text-red-600' },
];

const statusBadge: Record<string, string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

const statusLabel: Record<string, string> = {
  pending:  'รออนุมัติ',
  approved: 'อนุมัติแล้ว',
  rejected: 'ปฏิเสธแล้ว',
};

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<Filter>('pending');
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const res = await api.get<Comment[]>('/admin/comments', { params });
      setComments(res.data);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleStatus = async (id: number, status: 'approved' | 'rejected') => {
    setActionId(id);
    try {
      await api.patch(`/admin/comments/${id}`, { status });
      // ถ้า filter เป็น pending → เอา comment ออกจากลิสต์
      if (filter === 'pending') {
        setComments((prev) => prev.filter((c) => c.id !== id));
      } else {
        setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, status } : c)),
        );
      }
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันการลบ comment นี้?')) return;
    setActionId(id);
    try {
      await api.delete(`/admin/comments/${id}`);
      setComments((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setActionId(null);
    }
  };

  const pendingCount = comments.filter((c) => c.status === 'pending').length;

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">จัดการ Comment</h1>
        <p className="text-sm text-slate-400 mt-1">
          {filter === 'pending' && pendingCount > 0
            ? `${pendingCount} comment รอการอนุมัติ`
            : `${comments.length} comment`}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === tab.key
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <svg className="w-12 h-12 mx-auto mb-3 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">ไม่มี comment ในหมวดนี้</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-slate-100 rounded-2xl p-5 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {/* Avatar */}
                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-xs font-medium shrink-0">
                      {comment.authorName.charAt(0)}
                    </div>
                    <span className="font-medium text-slate-800 text-sm">{comment.authorName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusBadge[comment.status]}`}>
                      {statusLabel[comment.status]}
                    </span>
                    <span className="text-xs text-slate-400 ml-auto">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed break-words">
                    {comment.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {comment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatus(comment.id, 'approved')}
                        disabled={actionId === comment.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        อนุมัติ
                      </button>
                      <button
                        onClick={() => handleStatus(comment.id, 'rejected')}
                        disabled={actionId === comment.id}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        ปฏิเสธ
                      </button>
                    </>
                  )}

                  {comment.status === 'approved' && (
                    <button
                      onClick={() => handleStatus(comment.id, 'rejected')}
                      disabled={actionId === comment.id}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      ยกเลิกอนุมัติ
                    </button>
                  )}

                  {comment.status === 'rejected' && (
                    <button
                      onClick={() => handleStatus(comment.id, 'approved')}
                      disabled={actionId === comment.id}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-green-50 text-slate-500 hover:text-green-600 text-xs font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                      อนุมัติ
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={actionId === comment.id}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="ลบ"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}