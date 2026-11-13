"use client";

import React, { useState, useEffect } from "react";
import Logo from "@/components/Logo";

/**
 * App Loading / Splash Screen
 * Displays a centered beating logo for 1.5 seconds when the user opens the app.
 */
export default function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Show loading screen for exactly 1.5 seconds (1500ms), then smoothly fade out
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1800); // 300ms smooth fade transition before unmounting

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#FFDFC9] select-none transition-opacity duration-300 ease-out ${
        isFading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Loading track MEtro"
      role="status"
    >
      <div
        className="animate-logo-beat flex items-center justify-center"
        style={{ animation: "logoBeat 1s ease-in-out infinite" }}
      >
        <Logo className="h-16 sm:h-20 w-auto drop-shadow-xs" width={220} height={130} priority />
      </div>
    </div>
  );
}
