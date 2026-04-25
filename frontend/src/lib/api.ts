// Typed HTTP client functions for all DocuMind API endpoints
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

export async function fetchDocuments() {
  const res = await fetch(`${BASE_URL}/api/documents`);
  if (!res.ok) throw new Error("Failed to fetch documents");
  return res.json();
}

export async function uploadDocument(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE_URL}/api/documents`, { method: "POST", body: form });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
}

export async function askQuestion(question: string, documentId?: string) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, documentId }),
  });
  if (!res.ok) throw new Error("Chat request failed");
  return res.json();
}
