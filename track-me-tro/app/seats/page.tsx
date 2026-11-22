"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import {
  PASSENGER_SEAT_ROWS,
  DEFAULT_OCCUPIED_SEAT_IDS,
  calculateSegmentFare,
  normalizeStopName,
  ROUTE_70_STOPS_SOGOD_TO_ORMOC,
  ROUTE_70_STOPS_ORMOC_TO_SOGOD,
} from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function SelectSeatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    busDetails,
    selectedSeatNumber,
    setSelectedSeatNumber,
    passengerName,
    selectedDirection,
    setSelectedDirection,
    origin,
    setOrigin,
    destination,
    setDestination,
    verifiedDiscount,
    isPremium,
  } = useAppContext();

  // Sync direction from query params if specified
  const directionParam = searchParams.get("direction");
  useEffect(() => {
    if (directionParam === "ormoc-to-sogod" || directionParam === "sogod-to-ormoc") {
      if (directionParam !== selectedDirection) {
        setSelectedDirection(directionParam);
      }
    }
  }, [directionParam, selectedDirection, setSelectedDirection]);

  // Stops list for the active direction of travel
  const corridorStops = useMemo(
    () =>
      selectedDirection === "ormoc-to-sogod"
        ? ROUTE_70_STOPS_ORMOC_TO_SOGOD
        : ROUTE_70_STOPS_SOGOD_TO_ORMOC,
    [selectedDirection]
  );

  const normalizedOrigin = normalizeStopName(origin);
  const normalizedDestination = normalizeStopName(destination);

  // Available boarding stops (all stops except the final destination terminus)
  const availableOrigins = useMemo(
    () => corridorStops.slice(0, corridorStops.length - 1),
    [corridorStops]
  );

  // Active boarding stop, falling back to terminus
  const currentOrigin = useMemo(() => {
    if (availableOrigins.includes(normalizedOrigin as (typeof availableOrigins)[number])) {
      return normalizedOrigin;
    }
    return availableOrigins[0];
  }, [availableOrigins, normalizedOrigin]);

  const originIndex = corridorStops.indexOf(currentOrigin as (typeof corridorStops)[number]);

  // Available drop-off destinations: only stops strictly ahead of origin
  const availableDestinations = useMemo(
    () => corridorStops.slice(originIndex + 1),
    [corridorStops, originIndex]
  );

  // Active drop-off destination, falling back to last destination
  const currentDestination = useMemo(() => {
    if (availableDestinations.includes(normalizedDestination as (typeof availableDestinations)[number])) {
      return normalizedDestination;
    }
    return availableDestinations[availableDestinations.length - 1];
  }, [availableDestinations, normalizedDestination]);

  // Synchronize validated origin & destination to AppContext
  useEffect(() => {
    if (origin !== currentOrigin) {
      setOrigin(currentOrigin);
    }
    if (destination !== currentDestination) {
      setDestination(currentDestination);
    }
  }, [origin, destination, currentOrigin, currentDestination, setOrigin, setDestination]);

  const handleOriginChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOrigin = e.target.value;
    setOrigin(newOrigin);
    const newOriginIdx = corridorStops.indexOf(newOrigin as (typeof corridorStops)[number]);
    const downstream = corridorStops.slice(newOriginIdx + 1);
    if (!downstream.includes(destination as (typeof downstream)[number])) {
      setDestination(downstream[downstream.length - 1] || downstream[0]);
    }
  };

  const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDestination(e.target.value);
  };

  const handleToggleDirection = () => {
    const nextDir = selectedDirection === "sogod-to-ormoc" ? "ormoc-to-sogod" : "sogod-to-ormoc";
    setSelectedDirection(nextDir);
  };

  // Live segment fare calculation with 20% concession & standard ₱20 convenience fee
  const fareBreakdown = useMemo(() => {
    return calculateSegmentFare(currentOrigin, currentDestination, verifiedDiscount, {
      isPremium,
      includeConvenienceFee: true,
    });
  }, [currentOrigin, currentDestination, verifiedDiscount, isPremium]);

  // Preset mock occupancy matching design specs
  const occupiedSeatIds = new Set(DEFAULT_OCCUPIED_SEAT_IDS);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSeatClick = (seatNum: string) => {
    if (occupiedSeatIds.has(seatNum)) {
      showToast(`Seat ${seatNum} is already occupied.`);
      return;
    }
    setSelectedSeatNumber(seatNum);
  };

  const isWindowSeat = (seatNum: string) => {
    const num = parseInt(seatNum, 10);
    return num % 4 === 1 || num % 4 === 0;
  };

  const seatRows = PASSENGER_SEAT_ROWS;

  const discountLabel =
    verifiedDiscount === "student"
      ? "Student"
      : verifiedDiscount === "senior"
      ? "Senior Citizen"
      : verifiedDiscount === "pwd"
      ? "PWD"
      : "";

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-40">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <h1 className="text-[17px] font-extrabold tracking-tight text-[#191C1E]">
            Reserve Your Seat
          </h1>
          <p className="text-[11px] font-medium text-slate-500">
            Bus {busDetails.id} • Aircon Express
          </p>
        </div>

        <button
          type="button"
          onClick={() => showToast("Seat selection is live-synced with conductor dispatch.")}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Seat Info"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </button>
      </header>

      {/* ── Toast notification ── */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#181C24] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg animate-fade-in flex items-center gap-2">
          <span className="material-symbols-outlined text-[16px] text-[#F95700]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-[440px] w-full mx-auto px-4 pt-3.5 space-y-3.5">
        {/* ── Trip Segment Card (Destination & Boarding Stop Selector) ── */}
        <Card className="p-4 bg-white border border-[#ECEEF0] rounded-3xl shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#F95700] animate-pulse" />
              <span className="text-[12px] font-black uppercase tracking-wider text-slate-700">
                Route 70 Segment
              </span>
            </div>

            <button
              type="button"
              onClick={handleToggleDirection}
              className="flex items-center gap-1.5 bg-[#FFE8D6] text-[#A53700] hover:bg-[#FFDFC9] px-2.5 py-1 rounded-full text-[11px] font-bold transition active:scale-95 cursor-pointer"
              title="Tap to switch corridor direction"
            >
              <span>{selectedDirection === "sogod-to-ormoc" ? "Sogod ➔ Ormoc" : "Ormoc ➔ Sogod"}</span>
              <span className="material-symbols-outlined text-[14px]">swap_horiz</span>
            </button>
          </div>

          {/* Segment Pickers */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {/* Origin (Boarding Stop) */}
            <div className="space-y-1">
              <label htmlFor="origin-stop-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Boarding Stop
              </label>
              <div className="relative">
                <select
                  id="origin-stop-select"
                  value={currentOrigin}
                  onChange={handleOriginChange}
                  aria-label="Boarding Stop"
                  className="w-full h-10 pl-2.5 pr-7 text-[12px] font-extrabold text-[#191C1E] bg-[#F7F9FB] border border-[#ECEEF0] rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#F95700]/30 focus:border-[#F95700] cursor-pointer"
                >
                  {availableOrigins.map((stop) => (
                    <option key={`origin-${stop}`} value={stop}>
                      {stop}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Destination Stop */}
            <div className="space-y-1">
              <label htmlFor="destination-stop-select" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Destination
              </label>
              <div className="relative">
                <select
                  id="destination-stop-select"
                  value={currentDestination}
                  onChange={handleDestinationChange}
                  aria-label="Destination"
                  className="w-full h-10 pl-2.5 pr-7 text-[12px] font-extrabold text-[#191C1E] bg-[#F7F9FB] border border-[#ECEEF0] rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#F95700]/30 focus:border-[#F95700] cursor-pointer"
                >
                  {availableDestinations.map((stop) => (
                    <option key={`dest-${stop}`} value={stop}>
                      {stop}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          {/* Segment Distance & Concession Banner */}
          <div className="flex items-center justify-between pt-2 border-t border-[#ECEEF0] text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
              <span className="material-symbols-outlined text-[15px] text-slate-400">straighten</span>
              <span>{fareBreakdown.distanceKm} km ride</span>
            </div>

            {verifiedDiscount !== "regular" ? (
              <Badge variant="peach" className="gap-1 font-bold text-[10px] py-0.5 px-2.5">
                <span className="material-symbols-outlined text-[13px]">discount</span>
                <span>20% {discountLabel} Discount Applied</span>
              </Badge>
            ) : (
              <span className="text-[10px] font-bold text-slate-400">
                LTFRB Segment Fare
              </span>
            )}
          </div>
        </Card>

        {/* ── Legend Row ── */}
        <div className="flex items-center justify-center gap-6 py-0.5 text-[12px] font-semibold text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-white border border-[#E4BEB2]/80 shadow-2xs inline-block" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-[#ECEEF0] border border-slate-300 text-slate-400 flex items-center justify-center text-[10px]">
              ✕
            </span>
            <span>Occupied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-4 rounded-md bg-[#A53700] text-white flex items-center justify-center text-[10px] font-black shadow-2xs">
              ✓
            </span>
            <span className="text-[#A53700] font-bold">Selected</span>
          </div>
        </div>

        {/* ── Bus Cabin Schematic ── */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-[#ECEEF0] relative">
          {/* Top handle pill */}
          <div className="w-12 h-1 bg-[#ECEEF0] rounded-full mx-auto mb-4" />

          {/* Entrance & Driver indicators */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-dashed border-[#ECEEF0] text-[11px] font-bold text-slate-600">
            <div className="flex items-center gap-1.5 bg-[#F2F4F6] px-3 py-1 rounded-full border border-slate-200/60">
              <span className="material-symbols-outlined text-[15px] text-slate-500">door_front</span>
              <span className="tracking-wider">ENTRANCE</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#F2F4F6] px-3 py-1 rounded-full border border-slate-200/60">
              <span className="material-symbols-outlined text-[15px] text-slate-500">person</span>
              <span className="tracking-wider">DRIVER</span>
            </div>
          </div>

          {/* Column Headers */}
          <div className="grid grid-cols-5 text-center text-[11px] font-bold text-slate-400 mb-3 select-none">
            <div>A (Win)</div>
            <div>B</div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400">AISLE</div>
            <div>C</div>
            <div>D (Win)</div>
          </div>

          {/* Seat Grid Rows */}
          <div className="space-y-3">
            {seatRows.map((row) => {
              const seatA = row.seats[0];
              const seatB = row.seats[1];
              const seatC = row.seats[2];
              const seatD = row.seats[3];

              const renderSeat = (seatId: string) => {
                const isOccupied = occupiedSeatIds.has(seatId);
                const isSelected = selectedSeatNumber === seatId;

                if (isSelected) {
                  return (
                    <button
                      key={seatId}
                      type="button"
                      onClick={() => handleSeatClick(seatId)}
                      className="w-12 h-12 rounded-full bg-[#A53700] text-white flex items-center justify-center font-black text-[13px] shadow-md ring-4 ring-[#FFE8D6] transition-all transform scale-105 cursor-pointer mx-auto"
                      aria-label={`Seat ${seatId} Selected`}
                    >
                      <span className="flex items-center gap-0.5">
                        {seatId} <span className="text-[11px]">✓</span>
                      </span>
                    </button>
                  );
                }

                if (isOccupied) {
                  return (
                    <button
                      key={seatId}
                      type="button"
                      onClick={() => handleSeatClick(seatId)}
                      className="w-12 h-12 rounded-full bg-[#ECEEF0] text-slate-400 flex items-center justify-center font-bold text-[12px] cursor-not-allowed opacity-80 mx-auto"
                      aria-label={`Seat ${seatId} Occupied`}
                    >
                      {seatId}
                    </button>
                  );
                }

                return (
                  <button
                    key={seatId}
                    type="button"
                    onClick={() => handleSeatClick(seatId)}
                    className="w-12 h-12 rounded-full bg-white border border-[#E4BEB2]/90 text-[#191C1E] flex items-center justify-center font-bold text-[13px] shadow-2xs hover:border-[#F95700] hover:bg-[#FFE8D6]/30 transition active:scale-95 cursor-pointer mx-auto"
                    aria-label={`Select Seat ${seatId}`}
                  >
                    {seatId}
                  </button>
                );
              };

              return (
                <div key={row.rowNum} className="grid grid-cols-5 items-center">
                  <div>{renderSeat(seatA)}</div>
                  <div>{renderSeat(seatB)}</div>
                  <div className="text-center text-slate-300 font-bold text-sm select-none">
                    {row.arrow}
                  </div>
                  <div>{renderSeat(seatC)}</div>
                  <div>{renderSeat(seatD)}</div>
                </div>
              );
            })}
          </div>

          {/* Cabin Restroom Notice */}
          <div className="mt-5 pt-4 border-t border-[#ECEEF0] flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="material-symbols-outlined text-[16px] text-slate-400">wc</span>
            <span>Rear Cabin Restroom Available</span>
          </div>
        </div>
      </main>

      {/* ── Fixed Bottom Floating Action Card ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="max-w-[440px] mx-auto space-y-3">
          {/* Passenger & Fare Info Row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[17px] font-black text-[#191C1E]">
                  Seat {selectedSeatNumber}
                </span>
                <span className="bg-[#FFE8D6] text-[#A53700] font-bold text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {isWindowSeat(selectedSeatNumber) ? "Window" : "Aisle"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {passengerName} • {verifiedDiscount !== "regular" ? `${discountLabel} (20% Off)` : "Regular"}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-baseline justify-end gap-1.5">
                {fareBreakdown.discountAmount > 0 && (
                  <span className="text-[13px] font-bold text-slate-400 line-through">
                    ₱{fareBreakdown.baseFare.toFixed(2)}
                  </span>
                )}
                <div className="text-[20px] font-black text-[#A53700] tracking-tight leading-none">
                  ₱{fareBreakdown.totalFare.toFixed(2)}
                </div>
              </div>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                {fareBreakdown.discountAmount > 0 ? (
                  <span className="text-emerald-700 font-bold">
                    Saved ₱{fareBreakdown.discountAmount.toFixed(2)} • incl. ₱{fareBreakdown.convenienceFee} fee
                  </span>
                ) : (
                  <span>Total Fare (incl. ₱{fareBreakdown.convenienceFee} fee)</span>
                )}
              </p>
            </div>
          </div>

          {/* Amenities Row */}
          <div className="flex items-center justify-around py-1.5 px-3 bg-[#F7F9FB] rounded-xl border border-[#ECEEF0] text-[11px] font-semibold text-slate-600">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#A53700]">wifi</span>
              <span>Free Wi-Fi</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#A53700]">power</span>
              <span>USB Power</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-[#A53700]">luggage</span>
              <span>15kg Bag</span>
            </div>
          </div>

          {/* Continue CTA */}
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            className="w-full py-3.5 rounded-full bg-[#A53700] hover:bg-[#812900] active:scale-[0.98] text-white font-extrabold text-[15px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Continue to Checkout</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SelectSeatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center">
          <p className="text-sm font-bold text-slate-400">Loading seat map...</p>
        </div>
      }
    >
      <SelectSeatContent />
    </Suspense>
  );
}
