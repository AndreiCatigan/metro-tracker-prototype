import React from "react";

interface CrownIconProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Clean, lightweight vector Crown icon component
 * Used as a professional alternative to the OS-rendered crown emoji (👑)
 * for Track MeTro+ premium badges, perk indicators, and tier status.
 */
export default function CrownIcon({
  className = "w-4 h-4 inline-block",
  style,
}: CrownIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={`inline-block flex-shrink-0 ${className}`}
      style={style}
      aria-hidden="true"
    >
      <path d="M5 19h14v2H5v-2zm14-14l-3.5 5.5L12 4 8.5 10.5 5 5l1.5 12h11L19 5z" />
    </svg>
  );
}
