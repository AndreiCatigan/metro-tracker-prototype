"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AppShellProps {
  children: React.ReactNode;
  variant?: "passenger" | "conductor";
  className?: string;
  contentClassName?: string;
  /** Add bottom padding to account for fixed bottom navigation on mobile */
  withBottomNav?: boolean;
}

/**
 * Responsive Phone + Tablet Application Shell
 *
 * Phone (< 768px):
 * - Keeps a tight single-column mobile view with safe-area padding.
 * - Prevents horizontal overflow while providing edge-to-edge tactile feel.
 *
 * Tablet (md: 768px - 1024px, lg: > 1024px):
 * - "passenger": Centered max-w-3xl container to avoid awkward ultra-wide stretching.
 * - "conductor": Spacious max-w-6xl container ready for dual-column command dashboard.
 */
export default function AppShell({
  children,
  variant = "passenger",
  className,
  contentClassName,
  withBottomNav = false,
}: AppShellProps) {
  const containerMaxWidth =
    variant === "conductor" ? "md:max-w-6xl" : "md:max-w-3xl";

  return (
    <div
      className={cn(
        "min-h-screen w-full bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans antialiased",
        className
      )}
    >
      <main
        className={cn(
          "w-full mx-auto flex-1 flex flex-col transition-all duration-150",
          containerMaxWidth,
          withBottomNav ? "pb-28 md:pb-12" : "pb-8",
          contentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
}
