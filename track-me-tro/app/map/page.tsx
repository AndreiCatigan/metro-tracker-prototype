"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import {
  getActiveBuses,
  highwayWaypoints,
  ActiveBus,
  calculateBusETA,
} from "@/lib/mockData";
import BoardingAlertSheet from "@/components/BoardingAlertSheet";
import BottomNavigation from "@/components/BottomNavigation";

// Dynamically import Leaflet map component with ssr: false to prevent Next.js SSR window errors
const LiveMapLeaflet = dynamic(() => import("@/components/LiveMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[620px] flex flex-col items-center justify-center bg-[#EBF0F5] text-slate-500">
      <div className="w-10 h-10 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-bold text-slate-600">Loading Leyte Highway Map...</p>
    </div>
  ),
});

export default function MapPage() {
  const router = useRouter();
  const { isAlertActive, userLocation, simulatedTime } = useAppContext();

  // Route Direction Filter: 'sogod-to-ormoc' or 'ormoc-to-sogod'
  const [activeDirection, setActiveDirection] = useState<"sogod-to-ormoc" | "ormoc-to-sogod">(
    "sogod-to-ormoc"
  );

  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  // Dynamic active buses based on simulated time
  const allActiveBuses = useMemo(() => getActiveBuses(simulatedTime), [simulatedTime]);

  // Filtered active buses matching current route
  const filteredBuses = useMemo(
    () => allActiveBuses.filter((b) => b.direction === activeDirection),
    [allActiveBuses, activeDirection]
  );

  // Derived selected bus without cascading effect setState
  const selectedBus = useMemo(() => {
    if (isDismissed || filteredBuses.length === 0) return null;
    if (selectedBusId) {
      return filteredBuses.find((b) => b.id === selectedBusId) || filteredBuses[0] || null;
    }
    return filteredBuses[0] || null;
  }, [isDismissed, filteredBuses, selectedBusId]);

  // Map control trigger counters
  const [recenterCount, setRecenterCount] = useState(0);
  const [fitBoundsCount, setFitBoundsCount] = useState(0);

  // Boarding alert sheet modal
  const [isAlertSheetOpen, setIsAlertSheetOpen] = useState(false);

  // Toggle or swap route direction
  const handleToggleRoute = () => {
    const nextDirection =
      activeDirection === "sogod-to-ormoc" ? "ormoc-to-sogod" : "sogod-to-ormoc";
    setActiveDirection(nextDirection);
    setSelectedBusId(null);
    setIsDismissed(false);
  };

  const handleSelectBus = (bus: ActiveBus) => {
    setSelectedBusId(bus.id);
    setIsDismissed(false);
  };

  const handleDismissBus = () => {
    setIsDismissed(true);
  };

  // Primary CTA action: navigate to checkout
  const handleBookSeat = () => {
    if (!selectedBus) return;
    router.push(`/checkout?busId=${selectedBus.id}&direction=${activeDirection}`);
  };

  // Calculate dynamic ETA to commuter's simulated userLocation
  const etaData = selectedBus ? calculateBusETA(selectedBus, userLocation) : null;

  return (
    <div className="relative min-h-screen bg-[#EBF0F5] text-[#191C1E] flex flex-col font-sans overflow-hidden">
      {/* ── Top Floating Route Status Banner ── */}
      <div className="fixed top-3 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
        <div className="w-full max-w-[440px] bg-[#F95700] text-white rounded-full py-2 px-3.5 shadow-[0_6px_20px_rgba(249,87,0,0.35)] flex items-center justify-between pointer-events-auto border border-white/20">
          <button
            type="button"
            onClick={handleToggleRoute}
            className="flex items-center gap-2 hover:opacity-90 transition active:scale-95 cursor-pointer text-left"
            title="Tap to switch route direction"
            aria-label="Toggle Route Direction"
          >
            <div className="w-7 h-7 rounded-full bg-black/20 flex items-center justify-center font-black text-xs italic tracking-tighter">
              mE
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-[13px] tracking-tight">
                {activeDirection === "sogod-to-ormoc"
                  ? "Sogod ➔ Ormoc City"
                  : "Ormoc City ➔ Sogod"}
              </span>
              <span className="material-symbols-outlined text-[17px] text-white/90">
                swap_horiz
              </span>
            </div>
          </button>

          {/* Live Bus Counter Badge */}
          <div className="flex items-center gap-1.5 bg-[#FFCC00] text-[#7A5000] px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#7A5000] animate-ping" />
            <span>{filteredBuses.length} LIVE</span>
          </div>
        </div>
      </div>

      {/* ── Floating Map Action Buttons (Right Side) ── */}
      <div className="fixed top-16 right-4 z-30 flex flex-col gap-2.5">
        {/* Recenter on Selected Bus or User Location */}
        <button
          type="button"
          onClick={() => setRecenterCount((c) => c + 1)}
          className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 transition border border-slate-200/70 cursor-pointer active:scale-95"
          title={selectedBus ? "Recenter on Selected Bus" : `Recenter on ${userLocation}`}
          aria-label="Recenter"
        >
          <span className="material-symbols-outlined text-[20px]">my_location</span>
        </button>

        {/* View Full Route Corridor Overview */}
        <button
          type="button"
          onClick={() => setFitBoundsCount((c) => c + 1)}
          className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-md flex items-center justify-center hover:bg-slate-50 transition border border-slate-200/70 cursor-pointer active:scale-95"
          title="Corridor Overview (Full Route)"
          aria-label="Corridor Overview"
        >
          <span className="material-symbols-outlined text-[20px]">layers</span>
        </button>
      </div>

      {/* ── Interactive Leaflet Map Canvas ── */}
      <div className="relative flex-1 w-full max-w-[480px] mx-auto min-h-[640px] h-[calc(100vh-70px)] overflow-hidden">
        <LiveMapLeaflet
          buses={filteredBuses}
          selectedBusId={selectedBus ? selectedBus.id : null}
          onSelectBus={handleSelectBus}
          onMapClick={handleDismissBus}
          waypoints={highwayWaypoints}
          recenterTrigger={recenterCount}
          fitBoundsTrigger={fitBoundsCount}
          userLocation={userLocation}
        />
      </div>

      {/* ── Bottom Floating Transit Card (Level 2 Elevation) or Tap-to-View Pill ── */}
      <div className="fixed bottom-18 left-0 right-0 z-30 flex justify-center px-4 pointer-events-none">
        {selectedBus && etaData ? (
          <div className="relative w-full max-w-[440px] bg-white rounded-3xl p-4 shadow-[0_10px_25px_-4px_rgba(24,28,36,0.14)] border border-[#ECEEF0] space-y-3 pointer-events-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Card Drag Indicator Bar */}
            <div className="w-10 h-1 bg-[#D8DADC] rounded-full mx-auto -mt-1 mb-1" />

            {/* Route Destination & Bus Unit Header */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-[#F95700]">
                  <span className="w-2 h-2 rounded-full bg-[#F95700]" />
                  <span>
                    {activeDirection === "sogod-to-ormoc"
                      ? "Bound for Ormoc City"
                      : "Bound for Sogod Terminal"}
                  </span>
                </div>
                <h2 className="font-headline-lg text-[22px] font-black text-[#191C1E] mt-0.5">
                  Bus {selectedBus.id}
                </h2>
                {selectedBus.departureTime && (
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                    Departed {selectedBus.departureTime} • {selectedBus.currentLocation}
                  </p>
                )}
              </div>

              {/* Close Button & Direction Chip */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                  {activeDirection === "sogod-to-ormoc" ? "Outbound" : "Inbound"}
                </span>
                <button
                  type="button"
                  onClick={handleDismissBus}
                  className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer active:scale-95"
                  title="Close Bus Details"
                  aria-label="Close"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>
            </div>

            {/* Dynamic Real-time ETA to Simulated Commuter Location */}
            <div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-black text-[24px] leading-tight ${
                    etaData.hasPassed ? "text-slate-400" : "text-[#191C1E]"
                  }`}
                >
                  {etaData.etaText}
                </span>
              </div>
              <p className="text-[12px] text-slate-500 font-medium mt-0.5">
                {etaData.statusText}
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
                  {selectedBus.seatsLeft} Seats Left
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
              onClick={handleBookSeat}
              className="w-full py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-extrabold text-[15px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                confirmation_number
              </span>
              <span>Book a Ticket Now</span>
            </button>
          </div>
        ) : (
          /* Subtle helper pill when card is hidden */
          <div className="bg-[#181C24]/90 backdrop-blur-md text-white text-[11px] font-bold py-2.5 px-4 rounded-full shadow-lg flex items-center gap-2 border border-white/10 pointer-events-auto animate-in fade-in duration-200">
            <span className="material-symbols-outlined text-[16px] text-[#F95700]">
              touch_app
            </span>
            <span>Tap any bus marker on the map to view live ETA to {userLocation}</span>
          </div>
        )}
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
