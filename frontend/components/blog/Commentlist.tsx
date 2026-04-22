import { Comment } from '@/types/comment';

interface Props {
  comments: Comment[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

export default function CommentList({ comments }: Props) {
  const approved = comments.filter((c) => c.status === 'approved');

  return (
    <div className="mt-8">
      <h3 className="font-semibold text-slate-800 text-lg mb-5">
        ความคิดเห็น
        {approved.length > 0 && (
          <span className="ml-2 text-sm font-normal text-slate-400">({approved.length})</span>
        )}
      </h3>

      {approved.length === 0 ? (
        <div className="text-center py-10 text-slate-400">
          <svg className="w-10 h-10 mx-auto mb-2 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p className="text-sm">ยังไม่มีความคิดเห็น เป็นคนแรกที่แสดงความคิดเห็น</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approved.map((comment) => (
            <div
              key={comment.id}
              className="bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 text-sm font-medium">
                    {comment.authorName.charAt(0)}
                  </div>
                  <span className="font-medium text-slate-700 text-sm">
                    {comment.authorName}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed pl-10">
                {comment.body}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}