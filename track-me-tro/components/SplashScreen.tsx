"use client";

import React, { useState, useEffect } from "react";

interface SplashScreenProps {
  children?: React.ReactNode;
}

/**
 * Client Component Wrapper for App Launch Splash Screen
 * Displays a centered beating logo for 1.5 seconds every time someone visits or reloads the site,
 * then smoothly fades out over 300ms to reveal the application.
 *
 * Self-contained with inline CSS and direct image fallback to guarantee immediate
 * rendering on any deployment host (Vercel, Netlify, mobile PWA, static export)
 * without waiting for external stylesheets or serverless image optimizers.
 */
export default function SplashScreen({ children }: SplashScreenProps) {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Hold splash screen for exactly 1.5 seconds (1500ms)
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1500);

    // Completely unmount overlay after 300ms smooth fade transition (1800ms total)
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 1800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div
          id="track-metro-splash-screen"
          aria-label="Loading track MEtro"
          role="status"
          className={`fixed inset-0 z-[99999] flex items-center justify-center bg-[#FFDFC9] select-none transition-opacity duration-300 ease-out ${
            isFading ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 99999,
            backgroundColor: "#FFDFC9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isFading ? 0 : 1,
            pointerEvents: isFading ? "none" : "auto",
            transition: "opacity 300ms ease-out",
          }}
        >
          {/* Inline keyframe style ensures animation works before external CSS parses */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes inlineLogoBeat {
                0%, 100% { transform: scale(1); }
                14% { transform: scale(1.08); }
                28% { transform: scale(1); }
                42% { transform: scale(1.05); }
                70% { transform: scale(1); }
              }
              .inline-logo-beat {
                animation: inlineLogoBeat 1.25s ease-in-out infinite;
                transform-origin: center center;
                will-change: transform;
              }
            `
          }} />

          <div
            className="inline-logo-beat flex items-center justify-center"
            style={{
              animation: "inlineLogoBeat 1.25s ease-in-out infinite",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Standard img tag avoids _next/image serverless cold starts & 404s on static hosts */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-transparent.png"
              alt="track MEtro"
              width={220}
              height={130}
              style={{
                height: "72px",
                width: "auto",
                maxWidth: "80vw",
                objectFit: "contain",
                display: "block",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.06))",
              }}
            />
          </div>
        </div>
      )}
      {children}
    </>
  );
}
