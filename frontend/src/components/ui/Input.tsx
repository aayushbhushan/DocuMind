/**
 * components/ui/Input.tsx
 * A styled single-line text input.
 * "Controlled" means React owns the value — the parent holds it in useState
 * and passes it down via the value prop. onChange fires on every keystroke.
 */
'use client';

interface InputProps {
  value: string;
  onChange: (value: string) => void; // called with the new text on every keystroke
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function Input({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
}: InputProps) {
  return (
    <input
      type="text"
      value={value}
      // e is the browser event; e.target.value is what the user typed
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full rounded-lg px-3.5 py-2.5 text-sm
        bg-white border border-gray-200 text-gray-900 placeholder-gray-400
        focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
        disabled:opacity-50 disabled:cursor-not-allowed
        dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 dark:placeholder-zinc-500
        dark:focus:ring-violet-500
        transition-colors duration-150
        ${className}
      `}
    />
  );
}
