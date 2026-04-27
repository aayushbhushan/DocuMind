/**
 * components/ChatWindow.tsx
 * The RAG chat interface: user types a question, the AI answers using the document.
 *
 * React concepts used:
 * - useState: holds the messages array, current input text, loading state
 * - useRef: gives a direct DOM reference to the messages container so we can
 *   scroll it to the bottom whenever a new message arrives
 * - useEffect: runs code after render — used here to auto-scroll on new messages
 */
'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/types';
import { askQuestion } from '@/lib/api';
import Button from '@/components/ui/Button';

interface ChatWindowProps {
  documentId: number;
  documentName: string;
}

// These chips appear in the empty state so the user has example questions to click
const EXAMPLE_QUESTIONS = [
  'What is this document about?',
  'What are the key points?',
  'Summarize the main findings',
];

export default function ChatWindow({ documentId, documentName }: ChatWindowProps) {
  // messages: the full chat history shown on screen
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  // currentQuestion: the text currently typed in the input box
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // expandedSources: tracks which assistant messages have their sources expanded
  const [expandedSources, setExpandedSources] = useState<Set<number>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
    setCurrentQuestion('');
    setError(null);
    setExpandedSources(new Set());
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    setCurrentQuestion('');

    // Add the user's message to the chat immediately (optimistic update)
    const userMessage: ChatMessage = { role: 'user', content: trimmed };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const response = await askQuestion({ documentId, question: trimmed });
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.answer,
        sourceChunks: response.sourceChunks,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get a response.');
    } finally {
      setIsLoading(false);
    }
  }

  // Handle Enter key — submit on Enter, new line on Shift+Enter
  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(currentQuestion);
    }
  }

  function toggleSources(index: number) {
    setExpandedSources((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div className="flex flex-col h-full min-h-0">

      {/* ── Messages area ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 min-h-0">

        {/* Empty state */}
        {messages.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full gap-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 dark:bg-violet-900/20">
              <svg className="h-7 w-7 text-indigo-500 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-base font-medium text-gray-700 dark:text-zinc-300">
                Ask anything about <span className="text-indigo-600 dark:text-violet-400">{documentName}</span>
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-500">
                The AI will answer using only this document&apos;s content.
              </p>
            </div>
            {/* Example question chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              {EXAMPLE_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => sendQuestion(q)}
                  className="
                    rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600
                    hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50
                    dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400
                    dark:hover:border-violet-600 dark:hover:text-violet-400 dark:hover:bg-violet-900/20
                    transition-colors duration-150
                  "
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message bubbles */}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
              {/* Bubble */}
              <div
                className={`
                  rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap
                  ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white dark:bg-violet-600'
                    : 'bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-zinc-100'
                  }
                `}
              >
                {msg.content}
              </div>

              {/* Source chunks toggle (assistant messages only) */}
              {msg.role === 'assistant' && msg.sourceChunks && msg.sourceChunks.length > 0 && (
                <div className="mt-1.5">
                  <button
                    onClick={() => toggleSources(i)}
                    className="text-xs text-gray-500 hover:text-indigo-600 dark:text-zinc-500 dark:hover:text-violet-400 transition-colors"
                  >
                    {expandedSources.has(i) ? '▲ Hide' : '▼ Based on'} {msg.sourceChunks.length} source{msg.sourceChunks.length > 1 ? 's' : ''}
                  </button>
                  {expandedSources.has(i) && (
                    <div className="mt-2 space-y-2">
                      {msg.sourceChunks.map((chunk, ci) => (
                        <div
                          key={ci}
                          className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-600 leading-relaxed dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400"
                        >
                          <span className="font-medium text-gray-400 dark:text-zinc-600">Source {ci + 1} · </span>
                          {chunk.length > 300 ? chunk.slice(0, 300) + '…' : chunk}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Thinking animation while waiting for API response */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-1">
              <span className="w-2 h-2 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-400 dark:bg-zinc-500 rounded-full animate-bounce" />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Invisible anchor div — we scroll to this on new messages */}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input area ── */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Ask about ${documentName}…`}
            disabled={isLoading}
            className="
              flex-1 rounded-lg px-3.5 py-2.5 text-sm
              bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              disabled:opacity-50
              dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500
              dark:focus:ring-violet-500
            "
          />
          <Button
            onClick={() => sendQuestion(currentQuestion)}
            loading={isLoading}
            disabled={!currentQuestion.trim()}
            size="md"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
