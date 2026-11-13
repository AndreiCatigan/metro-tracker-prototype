"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext, PassengerHail } from "@/lib/AppContext";
import { highwayWaypoints } from "@/lib/data";
import CrownIcon from "@/components/CrownIcon";

// Dynamically import Leaflet map component with ssr: false to prevent Next.js SSR window errors
const ConductorMapLeaflet = dynamic(() => import("@/components/ConductorMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#EBF0F5] text-slate-500">
      <div className="w-10 h-10 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mb-3" />
      <p className="text-xs font-bold text-slate-600">Loading Route Map & Passenger Pings...</p>
    </div>
  ),
});

function ConductorMapContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryHailId = searchParams.get("hailId");

  const {
    busDetails,
    conductorName,
    selectedDirection,
    setSelectedDirection,
    currentBusStop,
    advanceToNextStop,
    passengerHails,
    acknowledgeHail,
    pickupHail,
    removeHail,
    hailBus,
  } = useAppContext();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [fitBoundsTrigger, setFitBoundsTrigger] = useState(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter active hails that haven't been boarded yet
  const activeHails = useMemo(() => {
    return passengerHails.filter((h) => h.status !== "boarded");
  }, [passengerHails]);

  // Selected Hail state: defaults to query param or first active hail
  const [selectedHailId, setSelectedHailId] = useState<string | null>(() => {
    if (queryHailId && activeHails.some((h) => h.id === queryHailId)) {
      return queryHailId;
    }
    return activeHails[0]?.id || null;
  });

  // Keep selectedHailId valid if hails change
  useEffect(() => {
    if (queryHailId && activeHails.some((h) => h.id === queryHailId)) {
      setSelectedHailId(queryHailId);
    } else if (selectedHailId && !activeHails.some((h) => h.id === selectedHailId)) {
      setSelectedHailId(activeHails[0]?.id || null);
    } else if (!selectedHailId && activeHails.length > 0) {
      setSelectedHailId(activeHails[0].id);
    }
  }, [queryHailId, activeHails, selectedHailId]);

  const selectedHail = useMemo(() => {
    return activeHails.find((h) => h.id === selectedHailId) || null;
  }, [activeHails, selectedHailId]);

  const handleSelectHail = (hail: PassengerHail) => {
    setSelectedHailId(hail.id);
    setRecenterTrigger((prev) => prev + 1);
  };

  const handleSimulateNewHail = () => {
    const sampleStops = [
      "VSU Main Campus",
      "Inopacan",
      "Hilongos",
      "Hindang",
      "Albuera",
      "Baybay City Terminal",
    ];
    const randomStop = sampleStops[Math.floor(Math.random() * sampleStops.length)];
    const sampleNames = [
      "Elena Bautista",
      "Marco Villafuerte",
      "Kristine Joy Tan",
      "Rafael Morales",
      "Althea Cruz",
    ];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const newHail = hailBus(busDetails.id, randomStop, "Approaching in 15 min");
    setSelectedHailId(newHail.id);
    setRecenterTrigger((prev) => prev + 1);
    showToast(`📍 New location ping: ${randomName} is waiting at ${randomStop}!`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#F4F6F9] text-[#191C1E] flex flex-col font-sans select-none">
      {/* ── Toast Notification ── */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1100] bg-[#181C24] text-white px-4 py-2.5 rounded-full text-xs font-semibold shadow-2xl border border-white/20 animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">cell_tower</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Top Header (Light Orange matching Dashboard) ── */}
      <header className="z-[1000] bg-[#FFDFC9] text-[#191C1E] px-4 py-3 shadow-xs border-b border-[#F5DECD] shrink-0">
        <div className="max-w-[480px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => router.push("/conductor")}
              className="w-9 h-9 rounded-full bg-white/60 hover:bg-white active:scale-95 transition flex items-center justify-center text-slate-800 shadow-2xs cursor-pointer"
              title="Back to Conductor Dashboard"
              aria-label="Back to Conductor Dashboard"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-black tracking-tight text-[#191C1E]">
                  PASSENGER HAIL MAP
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <p className="text-[10px] text-slate-600 font-semibold truncate max-w-[200px]">
                Bus {busDetails.id} • {activeHails.length} Waiting Passenger{activeHails.length === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                advanceToNextStop();
                showToast(`Bus location updated: Bus approaching ${currentBusStop}`);
              }}
              className="inline-flex items-center gap-1 bg-white/70 hover:bg-white active:scale-95 text-[#A53700] px-2.5 py-1.5 rounded-xl text-[10px] font-extrabold border border-[#F5DECD] transition cursor-pointer shadow-2xs"
              title="Tap to advance bus location to next stop"
            >
              <span className="material-symbols-outlined text-[13px]">location_on</span>
              <span className="max-w-[85px] truncate">{currentBusStop.split(" ")[0]}</span>
              <span className="material-symbols-outlined text-[12px] opacity-75">fast_forward</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Interactive Map Viewport ── */}
      <main className="relative flex-1 w-full h-full overflow-hidden">
        <ConductorMapLeaflet
          hails={passengerHails}
          selectedHailId={selectedHailId}
          onSelectHail={handleSelectHail}
          onMapClick={() => {}}
          currentBusStop={currentBusStop}
          busNumber={busDetails.id}
          conductorName={conductorName}
          direction={selectedDirection}
          waypoints={highwayWaypoints}
          recenterTrigger={recenterTrigger}
          fitBoundsTrigger={fitBoundsTrigger}
        />

        {/* ── Floating Route & Stats Strip ── */}
        <div className="absolute top-3 left-4 right-4 z-[1000] max-w-[440px] mx-auto pointer-events-none flex items-center justify-between gap-2">
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-2 px-3 shadow-md border border-slate-200/90 flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F95700] animate-pulse" />
            <span className="font-extrabold text-[#191C1E] text-[11px]">
              {selectedDirection === "sogod-to-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod"}
            </span>
            <span className="text-slate-300">|</span>
            <span className="font-bold text-slate-600 text-[10px]">
              {activeHails.length} Ping{activeHails.length === 1 ? "" : "s"} Active
            </span>
          </div>

          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleSimulateNewHail}
              className="bg-white/95 hover:bg-white active:scale-95 text-[#A53700] p-2 px-2.5 rounded-2xl shadow-md border border-slate-200 text-[10px] font-black flex items-center gap-1 cursor-pointer"
              title="Add a test passenger ping"
            >
              <span className="material-symbols-outlined text-[14px]">add_location_alt</span>
              <span>+ Ping</span>
            </button>

            <button
              type="button"
              onClick={() => setFitBoundsTrigger((prev) => prev + 1)}
              className="w-8 h-8 rounded-2xl bg-white/95 hover:bg-white active:scale-95 text-slate-700 shadow-md border border-slate-200 flex items-center justify-center cursor-pointer"
              title="Fit entire highway corridor"
              aria-label="Fit Corridor"
            >
              <span className="material-symbols-outlined text-[16px]">crop_free</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedHailId(null);
                setRecenterTrigger((prev) => prev + 1);
              }}
              className="w-8 h-8 rounded-2xl bg-[#101A2C] text-white hover:bg-black active:scale-95 shadow-md flex items-center justify-center cursor-pointer"
              title="Recenter on Conductor's Bus"
              aria-label="Recenter on Bus"
            >
              <span className="material-symbols-outlined text-[16px]">directions_bus</span>
            </button>
          </div>
        </div>

        {/* ── Floating Bottom Drawer: Passenger Hail Details & Actions ── */}
        <div className="absolute bottom-4 left-3 right-3 z-[1000] max-w-[440px] mx-auto space-y-2 pointer-events-auto">
          {/* Active Hails Selector Chips (if multiple hails exist) */}
          {activeHails.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {activeHails.map((h) => {
                const isSelected = h.id === selectedHailId;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => handleSelectHail(h)}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm transition active:scale-95 cursor-pointer border ${
                      isSelected
                        ? "bg-[#101A2C] text-white border-[#101A2C]"
                        : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    <span className="inline-flex items-center">
                      {h.tier === "premium" ? (
                        <CrownIcon className="w-3 h-3 text-amber-500" />
                      ) : (
                        <span className="material-symbols-outlined text-[13px] text-[#F95700]">location_on</span>
                      )}
                    </span>
                    <span>{h.passengerName.split(" ")[0]}</span>
                    <span className="text-[9px] opacity-75">({h.location.split(" ")[0]})</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Selected Hail Action Card */}
          {selectedHail ? (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-slate-200 space-y-3 animate-fade-in text-left">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-white shrink-0 shadow-xs ${
                      selectedHail.status === "acknowledged" ? "bg-[#1D6AE5]" : "bg-[#F95700]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">signpost</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-black text-[14px] text-[#191C1E]">
                        {selectedHail.passengerName}
                      </h4>
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                          selectedHail.tier === "premium"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {selectedHail.tier === "premium" ? (
                          <span className="inline-flex items-center gap-1">
                            <CrownIcon className="w-2.5 h-2.5 text-amber-700" />
                            <span>MEtro+</span>
                          </span>
                        ) : (
                          "Free Tier"
                        )}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[13px] text-[#F95700]">
                        location_on
                      </span>
                      <span>
                        Waiting at: <strong className="text-[#101A2C]">{selectedHail.location}</strong>
                      </span>
                    </p>

                    <p className="text-[10px] text-slate-500 font-medium">
                      Pinged at {selectedHail.timestamp} • {selectedHail.etaAtHail || "Approaching stop"}
                    </p>
                  </div>
                </div>

                {/* Status Indicator */}
                <span
                  className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase shrink-0 ${
                    selectedHail.status === "acknowledged"
                      ? "bg-blue-100 text-blue-800 border border-blue-200"
                      : "bg-orange-100 text-orange-800 animate-pulse border border-orange-200"
                  }`}
                >
                  {selectedHail.status === "acknowledged" ? "Crew Confirmed" : "Waiting"}
                </span>
              </div>

              {/* Action Buttons: "Done" (picked up passenger) and "Remove" (no passenger) */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const name = selectedHail.passengerName;
                    const loc = selectedHail.location;
                    pickupHail(selectedHail.id);
                    showToast(`✓ Done: Picked up ${name} at ${loc}!`);
                  }}
                  className="col-span-1 py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black text-[12px] shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Signify you successfully picked up passenger in this pinged area"
                >
                  <span className="material-symbols-outlined text-[17px]">check_circle</span>
                  <span>Done</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const name = selectedHail.passengerName;
                    const loc = selectedHail.location;
                    removeHail(selectedHail.id);
                    showToast(`Removed: No passenger at ${loc}.`);
                  }}
                  className="col-span-1 py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-black text-[12px] shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Signify there was no passenger in that pinged location"
                >
                  <span className="material-symbols-outlined text-[17px]">person_off</span>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/95 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-slate-200 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[20px]">check</span>
              </div>
              <div>
                <p className="font-extrabold text-[13px] text-[#191C1E]">
                  No Pending Passenger Hails
                </p>
                <p className="text-[11px] text-slate-500">
                  All roadside commuters along Route 04 are boarded or en route.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSimulateNewHail}
                className="py-2 px-4 rounded-xl bg-[#F95700] hover:bg-[#E04E00] text-white text-[11px] font-black transition cursor-pointer"
              >
                + Simulate Passenger Ping
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function ConductorMapPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F4F6F9] flex flex-col items-center justify-center p-8 text-center text-slate-500 font-bold">
          <div className="w-10 h-10 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mb-3" />
          <p>Loading Conductor Passenger Map...</p>
        </div>
      }
    >
      <ConductorMapContent />
    </Suspense>
  );
}
