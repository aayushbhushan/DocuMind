/**
 * app/page.tsx
 * Main dashboard with three-column layout when a document is open:
 *   LEFT   (w-64)  — sidebar: logo, upload button, document list
 *   CENTER (flex-1) — document viewer: PDF iframe or TXT reader
 *   RIGHT  (w-96)  — AI panel: Chat / Summary tabs
 *
 * When no document is selected the right two columns show the upload zone.
 */
'use client';

import { useState, useEffect } from 'react';
import type { DocumentSummary, Document } from '@/types';
import { getAllDocuments, deleteDocument } from '@/lib/api';
import { formatFileSize, formatRelativeTime } from '@/lib/utils';
import DocumentUploader from '@/components/DocumentUploader';
import DocumentViewer from '@/components/DocumentViewer';
import ChatWindow from '@/components/ChatWindow';
import SummaryPanel from '@/components/SummaryPanel';
import Button from '@/components/ui/Button';

// Stores the file data for documents uploaded in this browser session.
// URL.createObjectURL() creates a temporary URL the browser can display.
// textContent is only set for TXT files so we can render them in a <pre>.
type DocFile = { url: string; textContent: string | null };

// Which AI panel is active on the right side
type RightTab = 'chat' | 'summary';

export default function HomePage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);

  // selectedDoc: the document currently open in the viewer
  const [selectedDoc, setSelectedDoc] = useState<DocumentSummary | null>(null);

  // docFiles: Map of documentId → { url, textContent } for session-uploaded docs
  // We use a plain object instead of Map for simpler React state updates
  const [docFiles, setDocFiles] = useState<Record<number, DocFile>>({});

  // Whether we're showing the upload zone vs the document viewer
  const [showUpload, setShowUpload] = useState(false);

  // Which AI tab is active (only visible when a doc is selected)
  const [rightTab, setRightTab] = useState<RightTab>('chat');

  // Load the document list on first render
  useEffect(() => {
    getAllDocuments()
      .then(setDocuments)
      .catch(() => {}) // empty list is fine
      .finally(() => setIsLoadingDocs(false));
  }, []);

  async function handleDelete(e: React.MouseEvent, doc: DocumentSummary) {
    // Stop the click from also triggering openDocument on the parent button
    e.stopPropagation();
    if (!confirm(`Delete "${doc.fileName}"? This cannot be undone.`)) return;
    try {
      await deleteDocument(doc.id);
      setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
      // If the deleted doc was open, close the viewer
      if (selectedDoc?.id === doc.id) { setSelectedDoc(null); setShowUpload(false); }
      // Revoke the object URL to free browser memory
      const fileEntry = docFiles[doc.id];
      if (fileEntry) { URL.revokeObjectURL(fileEntry.url); setDocFiles((prev) => { const next = { ...prev }; delete next[doc.id]; return next; }); }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed.');
    }
  }

  // Called by DocumentUploader after upload + embeddings succeed
  async function handleUploadSuccess(doc: Document, file: File) {
    // Build the sidebar summary entry
    const summary: DocumentSummary = {
      id: doc.id,
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      createdAt: doc.createdAt,
    };
    setDocuments((prev) => [summary, ...prev]);

    // Create a browser-side URL for the file so DocumentViewer can render it
    const url = URL.createObjectURL(file);
    // For TXT files, also read the raw text so we can display it nicely
    const textContent = doc.fileType === 'txt' ? await file.text() : null;

    setDocFiles((prev) => ({ ...prev, [doc.id]: { url, textContent } }));
    setSelectedDoc(summary);
    setShowUpload(false);
    setRightTab('chat');
  }

  function openDocument(doc: DocumentSummary) {
    setSelectedDoc(doc);
    setShowUpload(false);
  }

  function fileIconColor(fileType: string) {
    return fileType === 'pdf' ? 'text-red-500' : 'text-blue-500';
  }

  // ── Layout ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden">

      {/* ══════════════════════════════════════════════════════
          LEFT SIDEBAR
      ══════════════════════════════════════════════════════ */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">

        {/* Logo */}
        <div className="px-4 py-4 border-b border-gray-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 dark:bg-violet-600 flex-shrink-0">
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-zinc-100 leading-tight">DocuMind</p>
              <p className="text-xs text-gray-400 dark:text-zinc-500 leading-tight">AI document intelligence</p>
            </div>
          </div>
        </div>

        {/* Upload button */}
        <div className="px-3 py-3 border-b border-gray-100 dark:border-zinc-800">
          <Button
            onClick={() => { setShowUpload(true); setSelectedDoc(null); }}
            variant={showUpload ? 'primary' : 'secondary'}
            className="w-full"
            size="sm"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </Button>
        </div>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto py-2">
          {isLoadingDocs ? (
            <div className="flex justify-center py-8">
              <svg className="animate-spin h-5 w-5 text-gray-300 dark:text-zinc-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            </div>
          ) : documents.length === 0 ? (
            <p className="py-8 text-center text-xs text-gray-400 dark:text-zinc-600 leading-relaxed px-4">
              No documents yet.<br />Upload your first document.
            </p>
          ) : (
            <div className="space-y-0.5 px-2">
              {documents.map((doc) => {
                const isActive = selectedDoc?.id === doc.id && !showUpload;
                return (
                  // group enables Tailwind's group-hover: prefix on child elements
                  <div
                    key={doc.id}
                    onClick={() => openDocument(doc)}
                    className={`
                      group relative w-full text-left rounded-lg px-3 py-2.5 cursor-pointer
                      transition-colors duration-100
                      ${isActive
                        ? 'bg-indigo-50 dark:bg-violet-900/20'
                        : 'hover:bg-gray-50 dark:hover:bg-zinc-800'
                      }
                    `}
                  >
                    <div className="flex items-start gap-2 pr-6">
                      <svg className={`mt-0.5 h-4 w-4 flex-shrink-0 ${fileIconColor(doc.fileType)}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-xs font-medium leading-tight ${isActive ? 'text-indigo-700 dark:text-violet-300' : 'text-gray-800 dark:text-zinc-200'}`}>
                          {doc.fileName}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-zinc-600 mt-0.5">
                          {formatFileSize(doc.fileSize)} · {formatRelativeTime(doc.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Trash icon — hidden by default, appears on row hover */}
                    <button
                      onClick={(e) => handleDelete(e, doc)}
                      title="Delete document"
                      className="
                        absolute right-2 top-1/2 -translate-y-1/2
                        p-1 rounded opacity-0 group-hover:opacity-100
                        text-gray-400 hover:text-red-500 hover:bg-red-50
                        dark:text-zinc-600 dark:hover:text-red-400 dark:hover:bg-red-900/20
                        transition-all duration-150
                      "
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════
          MAIN AREA — changes based on state
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 flex overflow-hidden">

        {/* Upload view — centered in the remaining space */}
        {(showUpload || (!selectedDoc && !showUpload)) && (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
            {showUpload ? (
              <div className="w-full max-w-lg">
                <h2 className="text-center text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-1">
                  Upload a Document
                </h2>
                <p className="text-center text-sm text-gray-500 dark:text-zinc-400 mb-4">
                  PDF or TXT · up to 10 MB · embeddings generated automatically
                </p>
                <DocumentUploader onUploadSuccess={handleUploadSuccess} />
              </div>
            ) : (
              // Nothing selected, not uploading
              <div className="flex flex-col items-center gap-4 text-center">
                <svg className="h-14 w-14 text-gray-300 dark:text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-gray-400 dark:text-zinc-600">
                  Select a document from the sidebar<br />or upload a new one
                </p>
                <Button onClick={() => setShowUpload(true)} variant="secondary" size="sm">
                  Upload Document
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Document viewer + AI panel — shown when a doc is selected */}
        {selectedDoc && !showUpload && (
          <>
            {/* ── CENTER: Document viewer ── */}
            <div className="flex-1 overflow-hidden border-r border-gray-200 bg-gray-50 dark:border-zinc-800 dark:bg-zinc-950">
              <DocumentViewer
                documentId={selectedDoc.id}
                fileName={selectedDoc.fileName}
                fileType={selectedDoc.fileType}
                fileUrl={docFiles[selectedDoc.id]?.url ?? null}
                textContent={docFiles[selectedDoc.id]?.textContent ?? null}
              />
            </div>

            {/* ── RIGHT: Chat / Summary panel ── */}
            <div className="w-96 flex-shrink-0 flex flex-col overflow-hidden bg-white dark:bg-zinc-900">

              {/* Tab bar */}
              <div className="flex-shrink-0 flex border-b border-gray-200 dark:border-zinc-800">
                <button
                  onClick={() => setRightTab('chat')}
                  className={`
                    flex-1 py-3 text-sm font-medium transition-colors duration-150
                    ${rightTab === 'chat'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-violet-400 dark:border-violet-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300'
                    }
                  `}
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => setRightTab('summary')}
                  className={`
                    flex-1 py-3 text-sm font-medium transition-colors duration-150
                    ${rightTab === 'summary'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 dark:text-violet-400 dark:border-violet-400'
                      : 'text-gray-500 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300'
                    }
                  `}
                >
                  📄 Summary
                </button>
              </div>

              {/* Panel content */}
              <div className="flex-1 overflow-hidden">
                {rightTab === 'chat' && (
                  <ChatWindow
                    documentId={selectedDoc.id}
                    documentName={selectedDoc.fileName}
                  />
                )}
                {rightTab === 'summary' && (
                  <SummaryPanel
                    documentId={selectedDoc.id}
                    documentName={selectedDoc.fileName}
                  />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
