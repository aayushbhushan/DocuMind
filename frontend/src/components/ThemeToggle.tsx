/**
 * components/ThemeToggle.tsx
 * A fixed button in the top-right corner that switches between light and dark mode.
 * It uses the useTheme hook from lib/useTheme.ts.
 *
 * How it works:
 * 1. useTheme() reads the saved preference from localStorage on first load.
 * 2. When clicked, it flips the isDark flag and adds/removes the "dark" class on <html>.
 * 3. Tailwind then applies all dark: prefixed styles automatically.
 */
'use client';

import { useTheme } from '@/lib/useTheme';

// Sun icon SVG — shown in dark mode (click to go light)
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

// Moon icon SVG — shown in light mode (click to go dark)
function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="
        fixed top-4 right-4 z-50
        w-9 h-9 flex items-center justify-center rounded-full
        bg-white border border-gray-200 text-gray-600
        hover:bg-gray-100 hover:text-gray-900
        dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400
        dark:hover:bg-zinc-700 dark:hover:text-zinc-100
        shadow-sm transition-all duration-200
      "
    >
      {/* Show sun when dark (to go light), moon when light (to go dark) */}
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
