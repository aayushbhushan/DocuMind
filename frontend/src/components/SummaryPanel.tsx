/**
 * components/SummaryPanel.tsx
 * Generates and displays an AI summary of a document.
 *
 * Component lifecycle:
 * 1. Renders with a "Generate Summary" button (summary = null)
 * 2. User clicks → API call starts (isLoading = true)
 * 3. API returns → summary text is stored in state and displayed
 * 4. User can click "Regenerate" to get a fresh summary
 */
'use client';

import { useState, useEffect } from 'react';
import { summarizeDocument } from '@/lib/api';
import Button from '@/components/ui/Button';

interface SummaryPanelProps {
  documentId: number;
  documentName: string;
}

export default function SummaryPanel({ documentId, documentName }: SummaryPanelProps) {
  // summary: null = not yet generated, string = the AI's summary text
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSummary(null);
    setError(null);
  }, [documentId]);

  async function fetchSummary() {
    setIsLoading(true);
    setError(null);
    try {
      const result = await summarizeDocument(documentId);
      setSummary(result.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary.');
    } finally {
      setIsLoading(false);
    }
  }

  // ── Loading state ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <svg className="animate-spin h-8 w-8 text-indigo-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p className="text-sm text-gray-500 dark:text-zinc-400">Analyzing document…</p>
        <p className="text-xs text-gray-400 dark:text-zinc-600">This may take up to a minute</p>
      </div>
    );
  }

  // ── Initial state — no summary yet ────────────────────────────────────────
  if (!summary) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-violet-900/20">
          <svg className="h-7 w-7 text-indigo-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-medium text-gray-700 dark:text-zinc-300">
            Summarize <span className="text-indigo-600 dark:text-violet-400">{documentName}</span>
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-500">
            AI will read the full document and write a structured summary.
          </p>
        </div>
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <Button onClick={fetchSummary} variant="primary">
          Generate Summary
        </Button>
      </div>
    );
  }

  // ── Summary result ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">
            Summary
          </h3>
          <p className="text-sm text-gray-500 dark:text-zinc-400">{documentName}</p>
        </div>
        <Button onClick={fetchSummary} variant="ghost" size="sm">
          Regenerate
        </Button>
      </div>

      {/* Summary text */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        {/* Split on newlines to preserve paragraph structure from the AI */}
        {summary.split('\n').map((line, i) => (
          line.trim() ? (
            <p key={i} className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0 dark:text-zinc-300">
              {line}
            </p>
          ) : (
            <div key={i} className="h-2" /> // blank line becomes spacing
          )
        ))}
      </div>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
