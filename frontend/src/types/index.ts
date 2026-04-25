// Shared TypeScript types mirroring the backend DTOs
export interface Document {
  id: string;
  fileName: string;
  contentType: string;
  fileSizeBytes: number;
  uploadedAt: string;
}

export interface ChatRequest {
  question: string;
  documentId?: string;
}

export interface ChatResponse {
  answer: string;
  sourceChunks: string[];
}

export interface DocumentSummaryResponse {
  documentId: string;
  summary: string;
  generatedAt: string;
}
