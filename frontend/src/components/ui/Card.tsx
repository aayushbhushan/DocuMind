/**
 * components/ui/Card.tsx
 * A simple white box with a border and shadow — used as a container for content.
 * This is a "Server Component" (no 'use client') because it has no state or event handlers.
 * Server Components render on the server, which is faster.
 */
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode; // anything you put between <Card> and </Card>
  className?: string;  // extra styles passed from the parent
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`
        bg-white border border-gray-200 rounded-xl shadow-sm p-6
        dark:bg-zinc-900 dark:border-zinc-800
        ${className}
      `}
    >
      {children}
    </div>
  );
}
