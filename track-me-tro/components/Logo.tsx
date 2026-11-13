import React from "react";
import Image from "next/image";

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
  alt?: string;
  priority?: boolean;
  unoptimized?: boolean;
}

export default function Logo({
  className = "h-9 w-auto",
  width = 160,
  height = 95,
  alt = "track MEtro",
  priority = true,
  unoptimized = true,
}: LogoProps) {
  return (
    <Image
      src="/logo-transparent.png"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      unoptimized={unoptimized}
      className={`object-contain ${className}`}
    />
  );
}
