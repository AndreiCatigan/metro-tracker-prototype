"use client";

import React, { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import {
  getActiveBuses,
  highwayWaypoints,
  ActiveBus,
  calculateBusETA,
} from "@/lib/mockData";
import BoardingAlertSheet from "@/components/BoardingAlertSheet";
import BottomNavigation from "@/components/BottomNavigation";
import MetroPlusModal from "@/components/MetroPlusModal";
import CrownIcon from "@/components/CrownIcon";

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

function MapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    isAlertActive,
    boardingAlertMinutes,
    stopAlert,
    userLocation,
    simulatedTime,
    selectedDirection,
    setSelectedDirection,
    isPremium,
    setIsModalOpen,
    hailBus,
    cancelHail,
    getActiveHailForBus,
  } = useAppContext();
  const directionParam = searchParams.get("direction");

  // Route Direction: URL query param takes priority, falling back to global AppContext selectedDirection
  const activeDirection: "sogod-to-ormoc" | "ormoc-to-sogod" =
    directionParam === "ormoc-to-sogod" || directionParam === "sogod-to-ormoc"
      ? directionParam
      : selectedDirection || "sogod-to-ormoc";

  const [selectedBusId, setSelectedBusId] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showMetroPlusModal, setShowMetroPlusModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

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
    setSelectedDirection(nextDirection);
    router.replace(`/map?direction=${nextDirection}`, { scroll: false });
    setSelectedBusId(null);
    setIsDismissed(false);
  };

  const handleSelectBus = useCallback((bus: ActiveBus) => {
    setSelectedBusId(bus.id);
    setIsDismissed(false);
  }, []);

  const handleDismissBus = useCallback(() => {
    setIsDismissed(true);
  }, []);

  // Primary CTA action: navigate to checkout (locked on Free Tier)
  const handleBookSeat = () => {
    if (!selectedBus) return;
    if (!isPremium) {
      setShowMetroPlusModal(true);
      return;
    }
    router.push(`/checkout?busId=${selectedBus.id}&direction=${activeDirection}`);
  };

  // Calculate dynamic ETA to commuter's simulated userLocation
  const etaData = selectedBus ? calculateBusETA(selectedBus, userLocation) : null;
  const activeHail = selectedBus ? getActiveHailForBus(selectedBus.id) : undefined;

  return (
    <div className="relative min-h-screen bg-[#EBF0F5] text-[#191C1E] flex flex-col font-sans overflow-hidden">
      {/* ── Toast Notification for Advance Hail / Alert ── */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-2 animate-fade-in max-w-[92vw] text-center border border-white/10">
          <span className="material-symbols-outlined text-[17px] text-[#F95700]">cell_tower</span>
          <span className="leading-tight">{toastMessage}</span>
        </div>
      )}
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
          isPremium={isPremium}
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
                <div className="flex items-center gap-2 mt-0.5">
                  <h2 className="font-headline-lg text-[22px] font-black text-[#191C1E]">
                    {isPremium ? `Bus ${selectedBus.id}` : "Express Metro Bus"}
                  </h2>
                </div>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Departed {selectedBus.departureTime || "Recently"} • {selectedBus.currentLocation}
                </p>
                {isPremium && (
                  <p className="text-[10px] font-semibold text-slate-700 mt-0.5">
                    Driver: {selectedBus.driverName || "Noel Dagami"}
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

            {/* Metadata Badges Row */}
            <div className="pt-1 border-t border-[#ECEEF0] text-[11px] text-slate-600 font-semibold space-x-1.5">
              {isPremium ? (
                <>
                  <span className="text-emerald-700 font-bold">Aircon Express</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Light Traffic</span>
                  <span>•</span>
                  <span className="text-[#F95700] font-bold">
                    👥 {40 - selectedBus.seatsLeft}/40 On Board ({selectedBus.seatsLeft} Left)
                  </span>
                </>
              ) : (
                <>
                  <span className="text-emerald-700 font-bold flex inline-flex items-center gap-1">
                    ● Live GPS Tracked
                  </span>
                  <span>•</span>
                  <span className="text-emerald-600 font-bold">Light Highway Traffic</span>
                </>
              )}
            </div>

            {/* ── Action Buttons Row: "Notify Bus" and "Alert Me" in the SAME ROW ── */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {/* Button 1: Notify Bus (Person raising hand icon) */}
              {activeHail ? (
                <div className="w-full bg-emerald-50 border border-emerald-300 rounded-2xl py-2 px-2.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[18px] text-emerald-700 shrink-0">
                      hail
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="font-black text-[11px] text-emerald-950 truncate">
                        {activeHail.status === "acknowledged" ? "Confirmed ✓" : "Notified ✓"}
                      </p>
                      <p className="text-[9px] text-emerald-700 font-semibold truncate">
                        Crew Alerted
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      cancelHail(selectedBus.id);
                      showToast(`Cancelled notification for ${isPremium ? selectedBus.id : "bus"}.`);
                    }}
                    className="text-[9px] font-bold text-rose-600 hover:underline px-1.5 py-0.5 bg-white rounded border border-rose-200 cursor-pointer shrink-0"
                    title="Cancel notification"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    hailBus(selectedBus.id, userLocation, etaData?.etaText);
                    showToast(
                      `📍 Driver & Conductor of ${isPremium ? selectedBus.id : "bus"} notified: You are waiting at ${userLocation} (${etaData?.etaText || "approaching"}).`
                    );
                  }}
                  className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-[13px] shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Notify bus driver & conductor of your location"
                >
                  <span className="material-symbols-outlined text-[19px]">hail</span>
                  <span>Notify Bus</span>
                </button>
              )}

              {/* Button 2: Alert Me / Active Alert with Stop Option */}
              {isAlertActive ? (
                <div className="w-full bg-[#FFF4ED] border border-[#F95700]/30 rounded-2xl py-2 px-2.5 flex items-center justify-between shadow-2xs">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsAlertSheetOpen(true);
                    }}
                    className="flex items-center gap-1.5 min-w-0 text-left cursor-pointer hover:opacity-90 transition"
                    title="Tap to adjust alert minutes"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#F95700] shrink-0">
                      notifications_active
                    </span>
                    <div className="min-w-0 leading-tight">
                      <p className="font-black text-[11px] text-[#A53700] truncate">
                        {boardingAlertMinutes}m Alert
                      </p>
                      <p className="text-[9px] text-[#F95700] font-semibold truncate">
                        Active • Tap edit
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      stopAlert();
                      showToast("Boarding alert stopped.");
                    }}
                    className="text-[9px] font-bold text-slate-600 hover:text-rose-600 hover:underline px-1.5 py-0.5 bg-white rounded border border-slate-200 cursor-pointer shrink-0 transition"
                    title="Stop boarding alert"
                  >
                    Stop
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAlertSheetOpen(true);
                  }}
                  className="w-full py-3 px-3 rounded-2xl bg-[#F2F4F6] text-slate-700 border border-slate-200 hover:bg-[#E6E8EA] font-extrabold text-[13px] shadow-sm transition active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Customize boarding alert minutes"
                >
                  <span className="material-symbols-outlined text-[18px]">notifications</span>
                  <span>Alert Me</span>
                </button>
              )}
            </div>

            {/* Full-width Seat Reservation CTA Button */}
            <button
              type="button"
              onClick={handleBookSeat}
              className={`w-full py-3.5 rounded-full text-white font-extrabold text-[15px] shadow-md active:scale-[0.98] transition flex items-center justify-center gap-2 cursor-pointer ${
                isPremium
                  ? "bg-[#F95700] hover:bg-[#E04E00]"
                  : "bg-[#181C24] hover:bg-black"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isPremium ? "confirmation_number" : "lock_open"}
              </span>
              <span>
                {isPremium ? (
                  "Book a Ticket • Reserve Seat"
                ) : (
                  <span className="inline-flex items-center gap-1.5">
                    <span>Reserve Seat •</span>
                    <CrownIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>Unlock MEtro+</span>
                  </span>
                )}
              </span>
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
        busId={selectedBus?.id}
        busName={isPremium ? `Bus ${selectedBus?.id}` : "Express Metro Bus"}
        currentEtaMinutes={etaData ? (etaData.etaMinutes <= 0 ? 0 : etaData.etaMinutes) : 30}
        userLocation={userLocation}
        onStopAlert={() => {
          showToast("Boarding alert stopped.");
        }}
        onSave={(mins) => {
          const actualMins = etaData ? (etaData.etaMinutes <= 0 ? 0 : etaData.etaMinutes) : 30;
          if (actualMins <= mins) {
            showToast(
              `⚠️ The bus is actually ${actualMins} mins away (closer than your ${mins}-min alert threshold). Head to your boarding stop now!`
            );
          } else {
            showToast(`Boarding alert set for ${mins} mins away!`);
          }
        }}
      />

      {/* ── MEtro+ Modal ── */}
      <MetroPlusModal
        isOpen={showMetroPlusModal}
        onClose={() => setShowMetroPlusModal(false)}
      />

      {/* ── Floating Pill Navigation ── */}
      <BottomNavigation />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-screen flex flex-col items-center justify-center bg-[#EBF0F5] text-slate-500">
          <div className="w-10 h-10 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs font-bold text-slate-600">Loading Leyte Highway Map...</p>
        </div>
      }
    >
      <MapContent />
    </Suspense>
  );
}
