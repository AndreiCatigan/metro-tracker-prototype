"use client";

import React, { useState, useRef } from "react";
import { PassengerHail } from "@/lib/AppContext";

interface SwipeableHailCardProps {
  hail: PassengerHail;
  onPickup: (hail: PassengerHail) => void;
  onRemove: (hail: PassengerHail) => void;
  onViewMap: (hail: PassengerHail) => void;
}

export default function SwipeableHailCard({
  hail,
  onPickup,
  onRemove,
  onViewMap,
}: SwipeableHailCardProps) {
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startXRef.current;
    if (diff < 0) {
      setDragOffset(Math.max(-120, diff));
    } else {
      setDragOffset(0);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    if (dragOffset < -65) {
      onRemove(hail);
    } else {
      setDragOffset(0);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    startXRef.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startXRef.current;
    if (diff < 0) {
      setDragOffset(Math.max(-120, diff));
    }
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (dragOffset < -65) {
      onRemove(hail);
    } else {
      setDragOffset(0);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl select-none shadow-2xs">
      {/* Background Revealed on Swipe Left: "No Passenger (Remove)" */}
      <div
        onClick={() => onRemove(hail)}
        className="absolute inset-0 bg-rose-600 text-white rounded-2xl flex items-center justify-end pr-4 cursor-pointer"
        title="Tap or release to remove (no passenger at location)"
      >
        <div className="flex flex-col items-center justify-center font-black text-right text-xs gap-0.5 pointer-events-none">
          <span className="material-symbols-outlined text-[20px]">person_off</span>
          <span className="text-[10px] uppercase tracking-wider">No Passenger</span>
          <span className="text-[9px] opacity-85">(Remove)</span>
        </div>
      </div>

      {/* Foreground Sliding Card */}
      <div
        style={{
          transform: `translateX(${dragOffset}px)`,
          transition: isDragging ? "none" : "transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1)",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative bg-white rounded-2xl p-3 border border-slate-200 text-left shadow-2xs"
      >
        <div className="flex items-center gap-3">
          {/* Circular Radio Button (Only radio button is visible) */}
          <button
            type="button"
            role="radio"
            aria-label="Pick up passenger in pinged area"
            onClick={(e) => {
              e.stopPropagation();
              onPickup(hail);
            }}
            className="w-7 h-7 rounded-full border-2 border-slate-400 hover:border-emerald-600 active:border-emerald-700 flex items-center justify-center bg-white hover:bg-emerald-50 active:scale-90 transition cursor-pointer shrink-0 shadow-2xs group"
            title="Pick up passenger (Tap radio button)"
          >
            <span className="w-3.5 h-3.5 rounded-full border border-slate-300 group-hover:border-emerald-600 bg-white group-hover:bg-emerald-600 group-active:bg-emerald-600 transition" />
          </button>

          {/* Passenger Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-black text-[13px] text-[#191C1E]">
                {hail.passengerName}
              </span>
              <span
                className={`text-[9px] font-black px-1.5 py-0.2 rounded ${
                  hail.tier === "premium"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-slate-200 text-slate-700"
                }`}
              >
                {hail.tier === "premium" ? "👑 MEtro+" : "Free Tier"}
              </span>
            </div>
            <p className="text-[11px] text-slate-700 font-bold mt-0.5 flex items-center gap-1 truncate">
              <span className="material-symbols-outlined text-[13px] text-[#F95700] shrink-0">location_on</span>
              <span className="truncate">Waiting at: <strong>{hail.location}</strong></span>
            </p>
            <p className="text-[10px] text-slate-500 font-medium">
              Pinged at {hail.timestamp} {hail.etaAtHail ? `• ${hail.etaAtHail}` : ""}
            </p>
          </div>

          {/* Map Link & Waiting Badge */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onViewMap(hail);
              }}
              className="py-1 px-2.5 rounded-xl bg-orange-50 border border-orange-200 hover:bg-orange-100 text-[#F95700] text-[10px] font-black transition flex items-center gap-1 cursor-pointer shadow-2xs"
              title="View on Map"
            >
              <span className="material-symbols-outlined text-[12px]">location_on</span>
              <span>Map</span>
            </button>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-orange-100 text-orange-800 animate-pulse">
              Waiting
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
