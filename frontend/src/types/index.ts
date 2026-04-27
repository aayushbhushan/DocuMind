/**
 * types/index.ts
 * TypeScript interfaces that mirror the backend DTOs exactly.
 * Every property name must match what the .NET API returns in JSON.
 * If the backend changes a field name, update it here too.
 */

/** A fully uploaded document with its chunk count. Returned by POST /api/documents/upload and GET /api/documents/{id} */
export interface Document {
  id: number;
  fileName: string;
  fileType: string;   // e.g. "pdf" or "txt"
  fileSize: number;   // bytes
  chunkCount: number; // how many text chunks were created
  createdAt: string;  // ISO 8601 date string, e.g. "2026-04-27T10:00:00Z"
  rawText?: string;   // full extracted text — present in GET /api/documents/{id}, absent in list
}

/** Lightweight document info for the sidebar list. Returned by GET /api/documents */
export interface DocumentSummary {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
  summary?: string; // optional — only present if summarized
}

/** A single message in the chat window. Not from the API — built locally in the component. */
export interface ChatMessage {
  role: 'user' | 'assistant'; // who sent this message
  content: string;
  sourceChunks?: string[];    // text passages used to answer (assistant messages only)
}

/** What we send to POST /api/chat/ask */
export interface ChatRequest {
  documentId: number;
  question: string;
}

/** What POST /api/chat/ask returns */
export interface ChatResponse {
  documentId: number;
  answer: string;
  sourceChunks: string[]; // text passages the AI used to build the answer
}
