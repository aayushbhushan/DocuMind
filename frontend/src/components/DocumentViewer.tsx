/**
 * components/DocumentViewer.tsx
 * Renders document content in the center panel.
 *
 * Priority order:
 *  1. PDF uploaded this session → <iframe> with objectURL
 *  2. TXT uploaded this session → <pre> with text content from memory
 *  3. Older PDF (not in memory) → fetches /api/documents/{id}/file as blob → <iframe>
 *  4. Older TXT (not in memory) → fetches rawText from API → <pre>
 */
'use client';

import { useState, useEffect } from 'react';
import { getDocument, getDocumentFileUrl } from '@/lib/api';

interface DocumentViewerProps {
  documentId: number;
  fileName: string;
  fileType: string;           // "pdf" or "txt"
  fileUrl: string | null;     // objectURL — present only for docs uploaded this session
  textContent: string | null; // raw text — present for TXT files uploaded this session
}

export default function DocumentViewer({
  documentId,
  fileName,
  fileType,
  fileUrl,
  textContent,
}: DocumentViewerProps) {
  const [fetchedUrl, setFetchedUrl] = useState<string | null>(null);
  const [fetchedText, setFetchedText] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // Revoke any previously created object URL to free memory
    if (fetchedUrl) {
      URL.revokeObjectURL(fetchedUrl);
      setFetchedUrl(null);
    }

    // If we already have everything in memory, nothing to fetch
    if (fileUrl || textContent) {
      setFetchedText(null);
      setFetchError(null);
      return;
    }

    setFetchedText(null);
    setFetchError(null);
    setIsFetching(true);

    if (fileType === 'pdf') {
      getDocumentFileUrl(documentId)
        .then((url) => setFetchedUrl(url))
        .catch(() => setFetchError('Could not load PDF.'))
        .finally(() => setIsFetching(false));
    } else {
      getDocument(documentId)
        .then((doc) => setFetchedText(doc.rawText ?? '(No text content available)'))
        .catch(() => setFetchError('Could not load document content.'))
        .finally(() => setIsFetching(false));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId, fileUrl, textContent, fileType]);

  // Clean up fetched object URL when component unmounts
  useEffect(() => {
    return () => {
      if (fetchedUrl) URL.revokeObjectURL(fetchedUrl);
    };
  }, [fetchedUrl]);

  const displayText = textContent ?? fetchedText;
  const displayUrl = fileUrl ?? fetchedUrl;

  // ── Shared toolbar ────────────────────────────────────────────────────────
  const Toolbar = () => (
    <div className="flex-shrink-0 flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-2.5 dark:border-zinc-800 dark:bg-zinc-900">
      <svg
        className={`h-4 w-4 flex-shrink-0 ${fileType === 'pdf' ? 'text-red-500' : 'text-blue-500'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <span className="text-xs font-medium text-gray-600 dark:text-zinc-400 truncate">{fileName}</span>
    </div>
  );

  // ── PDF (this session or fetched from API) ────────────────────────────────
  if (fileType === 'pdf' && displayUrl) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Toolbar />
        <iframe src={displayUrl} title={fileName} className="flex-1 w-full border-0" />
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Toolbar />
        <div className="flex-1 flex items-center justify-center gap-3 bg-white dark:bg-zinc-900">
          <svg className="animate-spin h-5 w-5 text-indigo-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <span className="text-sm text-gray-500 dark:text-zinc-400">Loading document…</span>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (fetchError) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Toolbar />
        <div className="flex-1 flex items-center justify-center bg-white dark:bg-zinc-900">
          <p className="text-sm text-red-500 dark:text-red-400">{fetchError}</p>
        </div>
      </div>
    );
  }

  // ── Text content (TXT in-memory OR fetched from API) ──────────────────────
  if (displayText !== null) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <Toolbar />
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900">
          <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700 dark:text-zinc-300 font-mono">
            {displayText}
          </pre>
        </div>
      </div>
    );
  }

  return null;
}
