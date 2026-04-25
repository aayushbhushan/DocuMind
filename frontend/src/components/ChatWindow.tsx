// Renders chat history and question input for document Q&A
"use client";

export default function ChatWindow() {
  return (
    <div className="flex flex-col h-full border rounded-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        <p className="text-gray-400 text-sm">Messages will appear here...</p>
      </div>
      <div className="border-t p-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Ask a question about your documents..."
        />
      </div>
    </div>
  );
}
