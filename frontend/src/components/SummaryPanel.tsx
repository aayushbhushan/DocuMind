// Displays the AI-generated summary for a selected document
"use client";

export default function SummaryPanel() {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="font-semibold mb-2">Document Summary</h3>
      <p className="text-gray-500 text-sm">Select a document to see its AI-generated summary.</p>
    </div>
  );
}
