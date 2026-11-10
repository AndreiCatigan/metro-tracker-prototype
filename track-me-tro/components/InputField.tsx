"use client";

import React, { useCallback, useId } from "react";

interface InputFieldProps {
  /** Field label rendered above the input */
  label: string;
  /** Controlled input value */
  value: string;
  /** Change handler — receives the raw string value */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** HTML input type */
  type?: string;
  /** Mobile keyboard hint */
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** Max character count */
  maxLength?: number;
  /** Node rendered to the left inside the input row (e.g. country-code capsule) */
  prefix?: React.ReactNode;
  /** Small badge / chip rendered opposite the label */
  badge?: React.ReactNode;
  /** Helper text shown beneath the input */
  helperText?: React.ReactNode;
  /** Material Symbol icon rendered beside the helper text */
  helperIcon?: string;
  /** Optional children rendered at the bottom of the card (e.g. PrimaryButton CTA) */
  children?: React.ReactNode;
  /** Additional className on the outer wrapper */
  className?: string;
}

/**
 * Kinetic Transit styled form input card.
 *
 * Renders inside a rounded card (`bg-surface-container-lowest rounded-lg p-space-lg shadow-sm`)
 * with an uppercase label, optional badge, pill-shaped input row
 * with an optional prefix slot (for country-code capsules, icons, etc.),
 * helper-text notice, and an optional slot for card actions (e.g. PrimaryButton).
 */
export default function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  maxLength,
  prefix,
  badge,
  helperText,
  helperIcon,
  children,
  className = "",
}: InputFieldProps) {
  const generatedId = useId();
  const inputId = `input-${generatedId}`;

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <div
      className={`bg-surface-container-lowest rounded-lg p-space-lg shadow-sm flex flex-col space-y-space-md ${className}`}
    >
      {/* Label row */}
      <div className="flex items-center justify-between">
        <label
          htmlFor={inputId}
          className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-wider font-bold"
        >
          {label}
        </label>
        {badge}
      </div>

      {/* Input row — pill-shaped container */}
      <div className="flex items-center gap-space-xs bg-surface-container-low p-1.5 rounded-full transition-all focus-within:bg-surface-container">
        {prefix}
        <input
          id={inputId}
          type={type}
          inputMode={inputMode}
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="flex-1 bg-transparent py-2.5 pr-4 pl-1 font-headline-sm text-headline-sm text-on-surface font-bold placeholder:text-secondary-fixed-dim outline-none"
        />
      </div>

      {/* Helper text notice */}
      {helperText && (
        <div className="flex items-start gap-2 pt-1 text-secondary">
          {helperIcon && (
            <span className="material-symbols-outlined text-[18px] text-primary shrink-0 mt-0.5">
              {helperIcon}
            </span>
          )}
          <p className="font-body-sm text-body-sm text-secondary">
            {helperText}
          </p>
        </div>
      )}

      {/* Bottom Card Actions (e.g. Primary CTA button) */}
      {children}
    </div>
  );
}
