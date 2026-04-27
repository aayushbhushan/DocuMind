/**
 * lib/utils.ts
 * Shared utility functions used throughout the frontend.
 * Pure functions with no side effects — no API calls, no React state.
 */

/** Convert a byte count into a human-readable string like "2.4 MB" or "512 KB". */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Convert an ISO date string into a relative time like "2 hours ago" or "3 days ago".
 * Uses the built-in Intl.RelativeTimeFormat API — no library needed.
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffSeconds < 60) return rtf.format(-diffSeconds, 'second');
  if (diffSeconds < 3600) return rtf.format(-Math.floor(diffSeconds / 60), 'minute');
  if (diffSeconds < 86400) return rtf.format(-Math.floor(diffSeconds / 3600), 'hour');
  if (diffSeconds < 2592000) return rtf.format(-Math.floor(diffSeconds / 86400), 'day');
  return rtf.format(-Math.floor(diffSeconds / 2592000), 'month');
}

/** Format a date as a short readable string like "Apr 27, 2026". */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
