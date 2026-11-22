"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  backHref?: string;
  rightAction?: React.ReactNode;
  className?: string;
  sticky?: boolean;
}

/**
 * Standardized Kinetic Transit Page Header
 * Provides responsive back navigation, title hierarchy, and right-hand action slot.
 */
export default function PageHeader({
  title,
  subtitle,
  onBack,
  backHref,
  rightAction,
  className,
  sticky = true,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const backButtonContent = (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={!backHref ? handleBack : undefined}
      className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 hover:bg-[#E6E8EA] hover:text-slate-900 active:scale-95 shrink-0"
      aria-label="Go back"
    >
      <ArrowLeft className="w-5 h-5" />
    </Button>
  );

  return (
    <header
      className={cn(
        "w-full bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-3 flex items-center justify-between transition-all",
        sticky ? "sticky top-0 z-30 pt-safe" : "",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {backHref ? (
          <Link href={backHref} className="shrink-0">
            {backButtonContent}
          </Link>
        ) : (
          backButtonContent
        )}

        <div className="flex flex-col min-w-0">
          <h1 className="text-[17px] font-black tracking-tight text-[#191C1E] truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-[11px] font-medium text-muted-foreground truncate">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {rightAction && (
        <div className="flex items-center gap-2 shrink-0">{rightAction}</div>
      )}
    </header>
  );
}
