'use client';

interface Props {
  page: number;
  lastPage: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, lastPage, onChange }: Props) {
  if (lastPage <= 1) return null;

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  // แสดงแค่ window รอบ current page
  const visible = pages.filter(
    (p) => p === 1 || p === lastPage || Math.abs(p - page) <= 1,
  );

  const withEllipsis: (number | '...')[] = [];
  let prev = 0;
  for (const p of visible) {
    if (p - prev > 1) withEllipsis.push('...');
    withEllipsis.push(p);
    prev = p;
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      {/* Prev */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ← ก่อนหน้า
      </button>

      {/* Pages */}
      {withEllipsis.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-slate-400 text-sm">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p as number)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              p === page
                ? 'bg-slate-800 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={page === lastPage}
        className="px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ถัดไป →
      </button>
    </div>
  );
}