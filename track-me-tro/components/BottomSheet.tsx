"use client";

import React from "react";

interface BottomSheetProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
}: BottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Sheet Content */}
      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-5 shadow-2xl z-10 max-h-[85vh] overflow-y-auto border-t border-slate-100">
        <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-4" />

        {title && (
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
            {onClose && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-slate-600 p-1 text-sm rounded-full"
                aria-label="Close"
              >
                &times;
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
}

