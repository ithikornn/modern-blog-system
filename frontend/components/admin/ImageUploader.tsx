'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { BlogImage } from '@/types/blog';
import { validateImages } from '@/lib/validators';

interface Props {
  existing: BlogImage[];
  onAdd: (files: File[]) => void;
  onRemove: (imageId: number) => void;
  apiUrl: string;
}

const MAX = 6;

export default function ImageUploader({ existing, onAdd, onRemove, apiUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState('');

  const total = existing.length + preview.length;
  const remaining = MAX - total;

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    const err = validateImages(arr, total);
    if (err) { setError(err); return; }
    setError('');
    const newPreviews = arr.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreview((prev) => [...prev, ...newPreviews]);
    onAdd(arr);
  };

  const removePreview = (index: number) => {
    setPreview((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].url);
      updated.splice(index, 1);
      return updated;
    });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-slate-600 mb-2">
        รูปภาพ
        <span className="font-normal text-slate-400 ml-1">({total}/{MAX} รูป)</span>
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {/* Existing images */}
        {existing.map((img) => (
          <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
            <img
              src={`${apiUrl}${img.url}`}
              alt=""
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => onRemove(img.id)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* New previews */}
        {preview.map((p, i) => (
          <div key={p.url} className="relative aspect-square rounded-xl overflow-hidden bg-slate-100 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
              ใหม่
            </div>
            <button
              type="button"
              onClick={() => removePreview(i)}
              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Upload button */}
        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-1 transition-all group"
          >
            <svg className="w-6 h-6 text-slate-300 group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span className="text-xs text-slate-400 group-hover:text-blue-400">เพิ่มรูป</span>
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}