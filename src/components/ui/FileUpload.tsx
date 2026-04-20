'use client';

import { useRef, useState } from 'react';
import { clsx } from 'clsx';
import { uploadFile, buildStoragePath, ALLOWED_TYPES, MAX_FILE_SIZE } from '@/lib/firebase/storage';
import { Spinner } from './Spinner';

interface FileUploadProps {
  uid: string;
  projectId: string;
  itemId: string;
  value?: { fileUrl: string; fileName: string } | null;
  onChange: (value: { fileUrl: string; fileName: string } | null) => void;
  disabled?: boolean;
}

export function FileUpload({ uid, projectId, itemId, value, onChange, disabled }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');

  async function handleFile(file: File) {
    setError('');
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only PDF, PNG, JPG, or XLSX files are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File must be under 10 MB.');
      return;
    }
    setProgress(0);
    try {
      const path = buildStoragePath(uid, projectId, itemId, file.name);
      const url = await uploadFile(file, path, setProgress);
      onChange({ fileUrl: url, fileName: file.name });
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setProgress(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }

  if (value) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
        <svg className="h-4 w-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <a href={value.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 truncate text-indigo-600 hover:underline">
          {value.fileName}
        </a>
        {!disabled && (
          <button type="button" onClick={() => onChange(null)} className="text-gray-400 hover:text-red-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => !disabled && inputRef.current?.click()}
        className={clsx(
          'flex flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-3 text-center text-sm transition-colors cursor-pointer',
          disabled ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/30'
        )}
      >
        {progress !== null ? (
          <div className="flex items-center gap-2">
            <Spinner size="sm" />
            <span className="text-gray-600">{Math.round(progress)}%</span>
          </div>
        ) : (
          <>
            <svg className="mb-1 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
            <span className="text-gray-500">Attach file <span className="text-gray-400">(PDF, PNG, JPG, XLSX · max 10 MB)</span></span>
          </>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <input ref={inputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.xlsx" onChange={handleChange} disabled={disabled} />
    </div>
  );
}
