/**
 * app/layout.tsx
 * The ROOT LAYOUT — wraps every single page in the app.
 * In Next.js App Router, layout.tsx provides the outer HTML shell (<html>, <body>)
 * that persists across all page navigations. The {children} slot is replaced
 * with each page's content when you navigate to it.
 *
 * This is a Server Component (no 'use client'), which means it renders on the
 * server. ThemeToggle needs client features, so it's a Client Component imported here.
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

// Inter is a clean, readable Google Font — loaded via Next.js's built-in font optimizer
// which automatically self-hosts it (no Google Fonts network request in the browser).
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', // exposes it as a CSS variable we use in globals.css
});

// Metadata is picked up by Next.js and turned into <title> and <meta> tags in <head>
export const metadata: Metadata = {
  title: 'DocuMind',
  description: 'AI-powered document intelligence — upload, chat, summarize.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; // the current page's content is injected here
}) {
  return (
    // lang="en" helps screen readers
    // className applies the Inter font variable to the entire document
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-200">
        {/* ThemeToggle is always visible — fixed top-right corner */}
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
