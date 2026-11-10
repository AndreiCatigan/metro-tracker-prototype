import React from "react";

interface BrandHeaderProps {
  /** Override the network label text */
  networkLabel?: string;
}

/**
 * Top branding section with the track MEtro logo, bus icon,
 * and pulsing "Live Network" pill badge.
 * Matches the Stitch Kinetic Transit header design.
 */
export default function BrandHeader({
  networkLabel = "Eastern Visayas • Live Network",
}: BrandHeaderProps) {
  return (
    <div className="relative w-full rounded-b-3xl bg-tertiary-fixed/30 p-space-lg flex flex-col items-center text-center overflow-hidden shadow-sm">
      {/* Decorative abstract transit-route path graphic */}
      <div className="absolute -right-8 -top-8 w-40 h-40 opacity-20 pointer-events-none text-primary">
        <svg
          className="w-full h-full stroke-current"
          fill="none"
          strokeLinecap="round"
          strokeWidth="12"
          viewBox="0 0 100 100"
        >
          <path d="M10 20 C 50 20, 50 80, 90 80 S 130 20, 170 20" />
        </svg>
      </div>

      {/* Stylized Logo */}
      <div className="flex items-center gap-space-xs mt-space-sm mb-space-xs">
        <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm">
          <span
            className="material-symbols-outlined text-[18px]"
            aria-hidden="true"
          >
            directions_bus
          </span>
        </div>
        <div className="flex items-baseline tracking-tight">
          <span className="font-headline-lg text-headline-lg text-on-surface">
            track
          </span>
          <span className="font-headline-lg text-headline-lg text-primary ml-0.5">
            MEtro
          </span>
        </div>
      </div>

      {/* Live Network Pill Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm mt-space-xs">
        <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
        <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {networkLabel}
        </span>
      </div>
    </div>
  );
}

