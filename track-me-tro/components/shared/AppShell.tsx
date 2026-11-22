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
    variant === "conductor" ? "max-w-[440px] md:max-w-4xl lg:max-w-5xl" : "max-w-[440px] md:max-w-2xl";

  return (
    <div
      className={cn(
        "min-h-dvh w-full bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans antialiased overflow-x-hidden",
        className
      )}
    >
      <main
        className={cn(
          "w-full mx-auto flex-1 flex flex-col transition-all duration-150 px-4 md:px-6",
          containerMaxWidth,
          withBottomNav ? "pb-32 pb-safe md:pb-16" : "pb-8",
          contentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
}
