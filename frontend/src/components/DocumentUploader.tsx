/**
 * components/DocumentUploader.tsx
 * Handles file selection, validation, upload, and automatic embedding generation.
 * The two steps (upload + embed) run back-to-back automatically — the user only
 * drops a file and waits for the "Ready" message.
 *
 * onUploadSuccess receives both the Document metadata AND the original File object
 * so the parent page can create a preview URL for the document viewer.
 */
'use client';

import { useState, useRef } from 'react';
import type { Document } from '@/types';
import { uploadDocument, generateEmbeddings } from '@/lib/api';
import { formatFileSize } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface DocumentUploaderProps {
  // Called after BOTH upload and embedding generation succeed
  onUploadSuccess: (document: Document, file: File) => void;
}

// Status drives what the UI shows — one value instead of multiple booleans
type UploadStatus = 'idle' | 'uploading' | 'embedding' | 'done' | 'error';

const MAX_SIZE = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = ['.pdf', '.txt'];

export default function DocumentUploader({ onUploadSuccess }: DocumentUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<Document | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  function validateFile(file: File): string | null {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) return 'Only PDF and TXT files are supported.';
    if (file.size > MAX_SIZE) return `File too large. Maximum is ${formatFileSize(MAX_SIZE)}.`;
    return null;
  }

  async function handleFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) { setError(validationError); return; }

    setError(null);

    // ── Step 1: Upload ────────────────────────────────────────────────────────
    setStatus('uploading');
    let doc: Document;
    try {
      doc = await uploadDocument(file);
      setUploadedDoc(doc);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
      setStatus('error');
      return;
    }

    // ── Step 2: Generate embeddings automatically ─────────────────────────────
    setStatus('embedding');
    try {
      await generateEmbeddings(doc.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Embedding generation failed.');
      setStatus('error');
      return;
    }

    // ── Done ──────────────────────────────────────────────────────────────────
    setStatus('done');
    onUploadSuccess(doc, file); // notify parent with both the metadata and the File
  }

  function onDragOver(e: React.DragEvent) { e.preventDefault(); setIsDragging(true); }
  function onDragLeave(e: React.DragEvent) { e.preventDefault(); setIsDragging(false); }
  function onDrop(e: React.DragEvent) {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }
  function onFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }
  function reset() {
    setStatus('idle'); setError(null); setUploadedDoc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  const isBusy = status === 'uploading' || status === 'embedding';

  // ── Success state ─────────────────────────────────────────────────────────
  if (status === 'done' && uploadedDoc) {
    return (
      <div className="flex flex-col items-center gap-6 p-8">
        <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">{uploadedDoc.fileName}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">
            {uploadedDoc.chunkCount} chunks · {formatFileSize(uploadedDoc.fileSize)}
          </p>
          <div className="mt-4 rounded-lg bg-indigo-50 p-3 dark:bg-violet-900/20">
            <p className="text-sm font-medium text-indigo-700 dark:text-violet-300">
              ✓ Ready — document is open in the viewer
            </p>
          </div>
        </div>
        <Button onClick={reset} variant="ghost" size="sm">Upload another document</Button>
      </div>
    );
  }

  // ── Loading state (uploading or embedding) ────────────────────────────────
  if (isBusy) {
    const label = status === 'uploading' ? 'Uploading file…' : 'Generating embeddings…';
    const sub   = status === 'uploading' ? 'Extracting text and creating chunks' : 'Building semantic search index';
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
        <svg className="animate-spin h-8 w-8 text-indigo-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">{label}</p>
        <p className="text-xs text-gray-400 dark:text-zinc-500">{sub}</p>
      </div>
    );
  }

  // ── Drop zone (idle / error) ───────────────────────────────────────────────
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <input ref={fileInputRef} type="file" accept=".pdf,.txt" className="hidden" onChange={onFileInput} />
      <div
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          w-full max-w-md cursor-pointer rounded-xl border-2 border-dashed p-12
          flex flex-col items-center gap-3 text-center transition-colors duration-150
          ${isDragging
            ? 'border-indigo-400 bg-indigo-50 dark:border-violet-500 dark:bg-violet-900/20'
            : 'border-gray-300 bg-white hover:border-indigo-300 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-violet-600 dark:hover:bg-zinc-800'
          }
        `}
      >
        <svg className="h-12 w-12 text-gray-400 dark:text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm font-medium text-gray-700 dark:text-zinc-300">Drop your PDF or TXT file here</p>
        <p className="text-xs text-gray-500 dark:text-zinc-500">or click to browse</p>
        <p className="text-xs text-gray-400 dark:text-zinc-600">PDF, TXT · Max 10 MB</p>
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
