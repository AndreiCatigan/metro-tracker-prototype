"use client";

import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Content inside the button (text or JSX) */
  children: React.ReactNode;
  /** Material Symbol icon name to render after the label */
  icon?: string;
  /** Shows a spinner and disables the button */
  loading?: boolean;
}

/**
 * Full-width pill CTA button in primary-container orange.
 * Supports a trailing Material Symbols icon and a loading spinner state.
 *
 * Design: `rounded-full`, `bg-primary-container`, bold headline-sm text,
 * subtle scale-down on press (`active:scale-[0.98]`).
 */
export default function PrimaryButton({
  children,
  icon,
  loading = false,
  disabled,
  className = "",
  ...rest
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={`
        w-full py-4 rounded-full
        bg-primary-container text-on-primary
        font-headline-sm text-headline-sm font-bold tracking-wide
        shadow-md
        active:scale-[0.98] transition-transform
        flex items-center justify-center gap-2
        cursor-pointer
        ${className}
      `}
      {...rest}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-on-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span>Verifying…</span>
        </>
      ) : (
        <>
          <span>{children}</span>
          {icon && (
            <span
              className="material-symbols-outlined text-[20px]"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  );
}
