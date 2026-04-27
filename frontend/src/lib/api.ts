/**
 * lib/api.ts
 * The ONLY file in the frontend that talks to the backend API.
 * All components import functions from here — they never call fetch() directly.
 *
 * BASE_URL is read from the environment variable NEXT_PUBLIC_API_URL.
 * "NEXT_PUBLIC_" prefix is required for Next.js to expose env vars to the browser.
 * It's set in frontend/.env.local → NEXT_PUBLIC_API_URL=http://localhost:5242
 */

import type { Document, DocumentSummary, ChatRequest, ChatResponse } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5242';

/** Helper: reads the response body and throws a descriptive Error if the request failed. */
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    // Try to read a JSON error message from the backend, fall back to status text
    let message = `API error ${res.status}`;
    try {
      const body = await res.json() as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // response wasn't JSON — use the status text instead
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

/**
 * Upload a PDF or TXT file.
 * Uses FormData because the backend expects multipart/form-data.
 * The field name "file" must match the parameter name in DocumentsController.Upload.
 */
export async function uploadDocument(file: File): Promise<Document> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${BASE_URL}/api/documents/upload`, {
    method: 'POST',
    body: form,
    // Note: do NOT set Content-Type header — the browser sets it automatically
    // with the correct multipart boundary when using FormData.
  });
  return handleResponse<Document>(res);
}

/**
 * Trigger embedding generation for all chunks of a document.
 * Must be called after upload before the document can answer questions.
 */
export async function generateEmbeddings(
  documentId: number
): Promise<{ documentId: number; embeddingsGenerated: number }> {
  const res = await fetch(`${BASE_URL}/api/documents/generate-embeddings/${documentId}`, {
    method: 'POST',
  });
  return handleResponse<{ documentId: number; embeddingsGenerated: number }>(res);
}

/** Fetch the list of all uploaded documents (lightweight, no raw text). */
export async function getAllDocuments(): Promise<DocumentSummary[]> {
  const res = await fetch(`${BASE_URL}/api/documents`);
  return handleResponse<DocumentSummary[]>(res);
}

/** Fetch a single document by ID including its chunk count. */
export async function getDocument(id: number): Promise<Document> {
  const res = await fetch(`${BASE_URL}/api/documents/${id}`);
  return handleResponse<Document>(res);
}

/**
 * Fetch raw file bytes for a document and return a browser object URL.
 * The caller is responsible for calling URL.revokeObjectURL() when done.
 */
export async function getDocumentFileUrl(id: number): Promise<string> {
  const res = await fetch(`${BASE_URL}/api/documents/${id}/file`);
  if (!res.ok) throw new Error(`Could not load file (${res.status})`);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

/** Send a question about a specific document and get an AI answer with source passages. */
export async function askQuestion(request: ChatRequest): Promise<ChatResponse> {
  const res = await fetch(`${BASE_URL}/api/chat/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });
  return handleResponse<ChatResponse>(res);
}

/** Permanently delete a document and all its chunks. */
export async function deleteDocument(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/documents/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(body.error ?? `Delete failed (${res.status})`);
  }
}

/**
 * Generate an AI summary of a document's full text.
 * Returns an object with { documentId, summary }.
 */
export async function summarizeDocument(
  documentId: number
): Promise<{ documentId: number; summary: string }> {
  const res = await fetch(`${BASE_URL}/api/chat/summarize/${documentId}`, {
    method: 'POST',
  });
  return handleResponse<{ documentId: number; summary: string }>(res);
}
