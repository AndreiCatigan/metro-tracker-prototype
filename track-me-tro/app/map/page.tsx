"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import BoardingAlertSheet from "@/components/BoardingAlertSheet";
import BottomNavigation from "@/components/BottomNavigation";

export default function MapPage() {
  const router = useRouter();
  const { busDetails, seats, isAlertActive } = useAppContext();
  const [isAlertSheetOpen, setIsAlertSheetOpen] = useState(false);
  const [busPositionProgress, setBusPositionProgress] = useState(48); // Percentage along route

  const availableSeatsCount = seats.filter((s) => s.status === "available").length;

  const handleAdvanceSimulation = () => {
    setBusPositionProgress((prev) => (prev >= 85 ? 25 : prev + 15));
  };

  return (
    <div className="relative min-h-screen bg-[#EBF0F5] text-[#191C1E] flex flex-col font-sans overflow-hidden">
      {/* ── Top Floating Route Status Banner ── */}
      <div className="fixed top-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-[440px] bg-[#F95700] text-white rounded-full py-2 px-4 shadow-[0_6px_20px_rgba(249,87,0,0.35)] flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center font-black text-xs italic">
              mE
            </div>
            <span className="font-extrabold text-[13px] tracking-tight">
              Sogod ➔ Ormoc City
            </span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#FFCC00] text-[#7A5000] px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7A5000] animate-ping" />
            <span>3 LIVE</span>
          </div>
        </div>
      </div>

      {/* ── Floating Map Action Buttons (Right Side) ── */}
      <div className="fixed top-16 right-4 z-30 flex flex-col gap-2.5">
        {/* Recenter Button */}
        <button
          type="button"
          onClick={handleAdvanceSimulation}
          className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 transition border border-slate-200/60 cursor-pointer active:scale-95"
          title="Advance Bus GPS Simulation"
          aria-label="Recenter"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        {/* Layers Button */}
        <button
          type="button"
          onClick={() => router.push("/schedule")}
          className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 transition border border-slate-200/60 cursor-pointer active:scale-95"
          title="View Bus Schedule"
          aria-label="Schedule"
        >
          <span className="material-symbols-outlined text-[20px]">layers</span>
        </button>

        {/* Schedule Floating Action Button */}
        <Link
          href="/schedule"
          className="w-11 h-11 rounded-2xl bg-[#F95700] text-white shadow-lg flex items-center justify-center hover:bg-[#E04E00] transition cursor-pointer active:scale-95 border-2 border-white mt-1"
          title="Open Bus Timetable"
        >
          <span className="material-symbols-outlined text-[22px]">calendar_month</span>
        </Link>
      </div>

      {/* ── Interactive Map Canvas ── */}
      <div className="relative flex-1 w-full max-w-[480px] mx-auto min-h-[580px] overflow-hidden">
        {/* SVG Street Grid & Coastal Transit Highway */}
        <svg
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 400 700"
        >
          <defs>
            <linearGradient id="waterGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#81C4EB" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#67B1E0" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="busPulse" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F95700" />
              <stop offset="100%" stopColor="#CE4700" />
            </linearGradient>
          </defs>

          {/* Grid Blocks (Townships) */}
          <rect x="20" y="80" width="80" height="90" fill="#E2E8EC" rx="6" />
          <rect x="110" y="80" width="70" height="90" fill="#E2E8EC" rx="6" />
          <rect x="20" y="180" width="80" height="120" fill="#E2E8EC" rx="6" />
          <rect x="110" y="180" width="70" height="60" fill="#E2E8EC" rx="6" />
          <rect x="110" y="250" width="70" height="80" fill="#DCE5DC" rx="6" />
          <rect x="20" y="310" width="80" height="100" fill="#E2E8EC" rx="6" />
          <rect x="110" y="340" width="70" height="90" fill="#E2E8EC" rx="6" />
          <rect x="20" y="420" width="160" height="110" fill="#DCE5DC" rx="6" />

          {/* Secondary Roads (White Grid Lines) */}
          <line x1="0" y1="80" x2="250" y2="80" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="0" y1="180" x2="250" y2="180" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="0" y1="310" x2="250" y2="310" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="0" y1="420" x2="250" y2="420" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="105" y1="0" x2="105" y2="600" stroke="#FFFFFF" strokeWidth="6" />
          <line x1="185" y1="0" x2="185" y2="600" stroke="#FFFFFF" strokeWidth="6" />

          {/* Coastal Waterway / Strait */}
          <path
            d="M 230 0 Q 210 250 250 400 T 220 700 L 400 700 L 400 0 Z"
            fill="url(#waterGrad)"
          />

          {/* Coastal Highway Road Base */}
          <path
            d="M 390 80 Q 230 250 215 380 T 50 670"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Active Transit Route Line (Dashed Electric Orange) */}
          <path
            d="M 390 80 Q 230 250 215 380 T 50 670"
            fill="none"
            stroke="#F95700"
            strokeWidth="4"
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
        </svg>

        {/* Town / Stop Text Markers on Map */}
        <div className="absolute top-12 right-6 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 shadow-2xs">
          Ormoc City
        </div>
        <div className="absolute top-[180px] left-30 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 shadow-2xs">
          Hilongos
        </div>
        <div className="absolute top-[320px] left-12 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 shadow-2xs">
          Baybay City
        </div>

        {/* Passenger Location Marker (Baybay City) */}
        <div className="absolute top-[345px] left-[135px] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="w-14 h-14 rounded-full bg-[#FFE8D6]/60 animate-ping absolute" />
          <div className="w-10 h-10 rounded-full bg-white shadow-md border-2 border-[#F95700] flex items-center justify-center text-[#181C24] relative z-10">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
        </div>

        {/* Moving Live Bus Marker */}
        <div
          className="absolute z-20 transition-all duration-700 flex flex-col items-center"
          style={{
            top: `${busPositionProgress}%`,
            left: `${65 - busPositionProgress * 0.3}%`,
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            {/* Glowing Orange Pulse */}
            <div className="w-12 h-12 rounded-full bg-[#F95700]/30 animate-ping absolute -top-1 -left-1" />
            {/* Bus Circle Badge */}
            <div className="w-10 h-10 rounded-full bg-[#F95700] text-white shadow-lg flex items-center justify-center border-2 border-white relative z-10">
              <span className="material-symbols-outlined text-[20px]">directions_bus</span>
            </div>
          </div>
        </div>

        {/* Floating Tooltip Callout on Route */}
        <div
          onClick={() => router.push("/seats")}
          className="absolute top-[48%] right-8 z-25 bg-white/95 backdrop-blur-xs text-[#191C1E] px-3 py-1 rounded-full text-[10px] font-black shadow-md border border-[#ECEEF0] flex items-center gap-1 cursor-pointer hover:scale-105 transition active:scale-95 animate-bounce"
        >
          <span>Book A Ticket Now!</span>
          <span className="text-[#F95700] font-bold">&rarr;</span>
        </div>
      </div>

      {/* ── Bottom Floating Transit Card (Level 2 Elevation) ── */}
      <div className="fixed bottom-18 left-0 right-0 z-30 flex justify-center px-4">
        <div className="w-full max-w-[440px] bg-white rounded-3xl p-4 shadow-[0_10px_25px_-4px_rgba(24,28,36,0.12)] border border-[#ECEEF0] space-y-3">
          {/* Card Drag Indicator Bar */}
          <div className="w-10 h-1 bg-[#D8DADC] rounded-full mx-auto -mt-1 mb-1" />

          {/* Route Destination & Bus Unit */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#F95700]">
                <span className="w-2 h-2 rounded-full bg-[#F95700]" />
                <span>Bound for Ormoc City</span>
              </div>
              <h2 className="font-headline-lg text-[22px] font-black text-[#191C1E] mt-0.5">
                Bus {busDetails.id}
              </h2>
            </div>
          </div>

          {/* Time & Distance Proximity */}
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-black text-[24px] text-[#191C1E] leading-tight">
                15 minutes
              </span>
            </div>
            <p className="text-[12px] text-slate-500 font-medium">
              Away from Baybay City Terminal
            </p>
          </div>

          {/* Metadata Badges & Alert Action Row */}
          <div className="flex items-center justify-between pt-1 border-t border-[#ECEEF0]">
            <div className="text-[11px] text-slate-600 font-semibold space-x-1.5">
              <span>Aircon</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">Light Traffic</span>
              <span>•</span>
              <span className="text-[#F95700] font-bold">
                {availableSeatsCount > 0 ? `${availableSeatsCount} Seats Left` : "9 Seats Left"}
              </span>
            </div>

            {/* Alert Me Pill Button */}
            <button
              type="button"
              onClick={() => setIsAlertSheetOpen(true)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                isAlertActive
                  ? "bg-[#FFE8D6] text-[#F95700] border border-[#E4BEB2]"
                  : "bg-[#F2F4F6] text-slate-700 hover:bg-[#E6E8EA]"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isAlertActive ? "notifications_active" : "notifications"}
              </span>
              <span>{isAlertActive ? "Alert Active" : "Alert me"}</span>
            </button>
          </div>

          {/* Full-width Orange Primary CTA */}
          <button
            type="button"
            onClick={() => router.push("/booking?trip=sogod-ormoc-trip-1&direction=sogod-ormoc")}
            className="w-full py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold text-[15px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
            <span>Book a Ticket Now</span>
          </button>
        </div>
      </div>

      {/* ── Boarding Alert Sheet ── */}
      <BoardingAlertSheet
        isOpen={isAlertSheetOpen}
        onClose={() => setIsAlertSheetOpen(false)}
      />

      {/* ── Floating Pill Navigation ── */}
      <BottomNavigation />
    </div>
  );
}
