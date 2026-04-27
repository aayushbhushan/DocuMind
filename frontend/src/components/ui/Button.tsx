/**
 * components/ui/Button.tsx
 * Reusable button component used throughout the app.
 *
 * What are "props" in React?
 * Props (short for properties) are the inputs you pass to a component,
 * similar to function arguments. For example:
 *   <Button variant="primary" loading={true}>Save</Button>
 * The component receives { variant: "primary", loading: true, children: "Save" }.
 */
'use client';

// React.ReactNode means "anything React can render" — text, elements, other components
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;           // the content inside the button
  onClick?: () => void;          // optional click handler (? means not required)
  variant?: 'primary' | 'secondary' | 'ghost'; // visual style
  size?: 'sm' | 'md' | 'lg';    // size of the button
  disabled?: boolean;            // greyed out and not clickable
  loading?: boolean;             // shows a spinner and disables the button
  type?: 'button' | 'submit';   // HTML button type (submit triggers form submission)
  className?: string;            // extra CSS classes from the parent component
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
}: ButtonProps) {

  // Base styles applied to every button regardless of variant
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles: light mode first, then dark: prefix for dark mode
  const variants = {
    primary:
      'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 dark:bg-violet-600 dark:hover:bg-violet-700 dark:focus:ring-violet-500',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600',
    ghost:
      'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:focus:ring-zinc-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading} // disable when loading too so user can't double-click
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {/* Show an animated spinner when loading=true */}
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
