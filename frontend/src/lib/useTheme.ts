/**
 * lib/useTheme.ts
 * A custom React "hook" for managing light/dark mode.
 *
 * What is a hook?
 * A hook is a function whose name starts with "use" that lets you add
 * React features (like state and side effects) to a component.
 * You call it at the top of a component: const { isDark, toggleTheme } = useTheme()
 *
 * What is useState?
 * useState lets a component remember a value between renders.
 * const [isDark, setIsDark] = useState(false) means:
 *   - isDark is the current value (starts as false)
 *   - setIsDark is the function to change it
 * Every time setIsDark is called, React re-renders the component.
 *
 * What is useEffect?
 * useEffect runs code AFTER the component renders.
 * The [] at the end means "run this only once, when the component first appears".
 * We use it here to read localStorage and set the initial theme.
 */
'use client';

import { useState, useEffect } from 'react';

interface ThemeHook {
  isDark: boolean;
  toggleTheme: () => void;
}

export function useTheme(): ThemeHook {
  // isDark = true means dark mode is active
  // We start with false and correct it in useEffect (can't read localStorage on the server)
  const [isDark, setIsDark] = useState(false);

  // On first render: read saved preference from localStorage and apply it
  useEffect(() => {
    const saved = localStorage.getItem('documind-theme');
    const prefersDark = saved === 'dark';
    setIsDark(prefersDark);
    // Add or remove the "dark" class on <html> — Tailwind's dark: prefix watches for this
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // [] means this only runs once when the component mounts

  // Called when user clicks the toggle button
  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);

    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('documind-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('documind-theme', 'light');
    }
  };

  return { isDark, toggleTheme };
}
