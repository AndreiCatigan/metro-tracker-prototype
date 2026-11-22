"use client";

import React, { useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import {
  calculateSegmentFare,
  normalizeStopName,
  ROUTE_70_STOPS_SOGOD_TO_ORMOC,
  ROUTE_70_STOPS_ORMOC_TO_SOGOD,
  activeBuses,
  ActiveBus,
} from "@/lib/data";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    busDetails,
    passengerName,
    selectedDirection,
    setSelectedDirection,
    origin,
    setOrigin,
    destination,
    setDestination,
    verifiedDiscount,
    discountIdNumber,
    isPremium,
  } = useAppContext();

  // Query param overrides (e.g. from /map or /home)
  const queryBusId = searchParams.get("busId");
  const queryDirection = searchParams.get("direction");

  useEffect(() => {
    if (queryDirection) {
      if (queryDirection === "sogod-to-ormoc" || queryDirection === "sogod-ormoc") {
        if (selectedDirection !== "sogod-to-ormoc") {
          setSelectedDirection("sogod-to-ormoc");
        }
      } else if (queryDirection === "ormoc-to-sogod" || queryDirection === "ormoc-sogod") {
        if (selectedDirection !== "ormoc-to-sogod") {
          setSelectedDirection("ormoc-to-sogod");
        }
      }
    }
  }, [queryDirection, selectedDirection, setSelectedDirection]);

  // Determine active bus
  const activeBus = useMemo(() => {
    if (queryBusId) {
      const found = activeBuses.find((b: ActiveBus) => b.id === queryBusId);
      if (found) return found;
    }
    return activeBuses.find((b: ActiveBus) => b.direction === selectedDirection) || activeBuses[0];
  }, [queryBusId, selectedDirection]);

  // Corridor stops according to direction
  const corridorStops = useMemo(() => {
    return selectedDirection === "sogod-to-ormoc"
      ? ROUTE_70_STOPS_SOGOD_TO_ORMOC
      : ROUTE_70_STOPS_ORMOC_TO_SOGOD;
  }, [selectedDirection]);

  // Ensure origin and destination match the active corridor direction
  useEffect(() => {
    const normOrigin = normalizeStopName(origin);
    const normDest = normalizeStopName(destination);
    const originInCorridor = corridorStops.some((s) => normalizeStopName(s) === normOrigin);
    const destInCorridor = corridorStops.some((s) => normalizeStopName(s) === normDest);

    if (!originInCorridor) {
      setOrigin(corridorStops[0]);
    }
    if (!destInCorridor) {
      setDestination(corridorStops[corridorStops.length - 1]);
    }
  }, [corridorStops, origin, destination, setOrigin, setDestination]);

  // Calculate origin index and available destinations
  const originIndex = useMemo(() => {
    const idx = corridorStops.findIndex((s) => normalizeStopName(s) === normalizeStopName(origin));
    return idx >= 0 ? idx : 0;
  }, [corridorStops, origin]);

  const availableDestinations = useMemo(() => {
    return corridorStops.slice(originIndex + 1);
  }, [corridorStops, originIndex]);

  // Ensure destination is strictly ahead of origin
  useEffect(() => {
    if (availableDestinations.length > 0) {
      const currentDestValid = availableDestinations.some(
        (s) => normalizeStopName(s) === normalizeStopName(destination)
      );
      if (!currentDestValid) {
        setDestination(availableDestinations[availableDestinations.length - 1]);
      }
    }
  }, [availableDestinations, destination, setDestination]);

  // Calculate live dynamic segment fare
  const fareBreakdown = useMemo(() => {
    return calculateSegmentFare(origin, destination, verifiedDiscount, {
      isPremium,
      includeConvenienceFee: true,
    });
  }, [origin, destination, verifiedDiscount, isPremium]);

  const discountLabel =
    verifiedDiscount === "student"
      ? "Student"
      : verifiedDiscount === "senior"
      ? "Senior Citizen"
      : verifiedDiscount === "pwd"
      ? "PWD"
      : "";

  const handleToggleDirection = (dir: "sogod-to-ormoc" | "ormoc-to-sogod") => {
    setSelectedDirection(dir);
    if (dir === "sogod-to-ormoc") {
      setOrigin("Sogod Terminal");
      setDestination("Ormoc City");
    } else {
      setOrigin("Ormoc City");
      setDestination("Sogod Terminal");
    }
  };

  const handleProceedToPayment = () => {
    router.push("/checkout");
  };

  return (
    <div className="min-h-dvh bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-cta-safe overflow-x-hidden">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] pt-header-safe pb-3">
        <div className="w-full max-w-[440px] md:max-w-2xl mx-auto px-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
            aria-label="Back"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-black tracking-tight text-[#191C1E]">Reserve a Seat</h1>
            <p className="text-[11px] font-semibold text-slate-500">Trip &amp; Destination Selection</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">confirmation_number</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[440px] md:max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* ── Trip Segment Card ── */}
        <Card className="p-4 sm:p-5 shadow-xs border-[#ECEEF0] space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="flex items-center gap-1.5 bg-[#FFE8D6] text-[#A53700] px-3 py-1 rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
              Corridor Segment
            </span>

            {/* Direction Switcher Toggle */}
            <div className="flex items-center bg-[#ECEEF0] p-1 rounded-xl text-xs font-bold">
              <button
                type="button"
                onClick={() => handleToggleDirection("sogod-to-ormoc")}
                className={`py-1.5 px-3 rounded-lg transition cursor-pointer ${
                  selectedDirection === "sogod-to-ormoc"
                    ? "bg-[#181C24] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sogod ➔ Ormoc
              </button>
              <button
                type="button"
                onClick={() => handleToggleDirection("ormoc-to-sogod")}
                className={`py-1.5 px-3 rounded-lg transition cursor-pointer ${
                  selectedDirection === "ormoc-to-sogod"
                    ? "bg-[#181C24] text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Ormoc ➔ Sogod
              </button>
            </div>
          </div>

          {/* Boarding and Destination Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Boarding Stop (Origin)
              </label>
              <div className="relative">
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full bg-[#F7F9FB] border border-[#ECEEF0] rounded-xl px-3 py-2.5 text-xs font-extrabold text-[#191C1E] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F95700]/30"
                >
                  {corridorStops.slice(0, -1).map((stop) => (
                    <option key={stop} value={stop}>
                      {stop}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  unfold_more
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Drop-off Destination
              </label>
              <div className="relative">
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="w-full bg-[#F7F9FB] border border-[#ECEEF0] rounded-xl px-3 py-2.5 text-xs font-extrabold text-[#191C1E] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F95700]/30"
                >
                  {availableDestinations.map((stop) => (
                    <option key={stop} value={stop}>
                      {stop}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-[16px] text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  unfold_more
                </span>
              </div>
            </div>
          </div>

          {/* Segment Route Summary & Active Bus Preview */}
          <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#ECEEF0] flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Bus Unit</p>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-black text-[#191C1E]">
                  Bus {activeBus.id || busDetails.id}
                </span>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Aircon Express
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {origin} ➔ {destination} • ~{fareBreakdown.distanceKm.toFixed(1)} km
              </p>
            </div>

            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Arrival</p>
              <p className="text-[13px] font-black text-[#A53700]">~12 mins</p>
              <p className="text-[10px] text-slate-400 font-medium">at {origin}</p>
            </div>
          </div>
        </Card>

        {/* ── Conductor-Assigned Seating Informational Note ── */}
        <div className="bg-[#FFE8D6]/50 border border-[#F5DECD] rounded-2xl p-4 flex items-start gap-3 text-xs shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#F95700] text-white flex items-center justify-center shrink-0 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">airline_seat_recline_normal</span>
          </div>
          <div className="space-y-1">
            <p className="text-[13px] font-black text-[#191C1E]">
              Conductor-Assigned Seating
            </p>
            <p className="text-slate-600 font-medium leading-relaxed text-[11.5px]">
              Seats are assigned by the bus conductor upon payment confirmation. After checkout, you will enter a live status screen while the conductor on Bus {activeBus.id || busDetails.id} selects your seat.
            </p>
          </div>
        </div>

        {/* ── Passenger & Verification Info ── */}
        <Card className="p-4 sm:p-5 shadow-xs border-[#ECEEF0] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Passenger Profile
            </span>
            {verifiedDiscount !== "regular" ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                <span>Verified {discountLabel}</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="text-[11px] font-bold text-[#F95700] hover:underline cursor-pointer"
              >
                Verify 20% Discount →
              </button>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#E0E3E5] text-slate-700 font-bold text-xs flex items-center justify-center">
                {passengerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-[14px] font-black text-[#191C1E]">{passengerName}</p>
                <p className="text-[11px] text-slate-400 font-medium">
                  {verifiedDiscount !== "regular" ? `ID: ${discountIdNumber || "On File"}` : "Regular Fare Commuter"}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <span className="material-symbols-outlined text-[13px]">schedule</span>
                <span>Dep: 08:00 AM</span>
              </span>
            </div>
          </div>
        </Card>

        {/* ── Fare Breakdown Card ── */}
        <Card className="p-4 sm:p-5 shadow-xs border-[#ECEEF0] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              FARE BREAKDOWN
            </h3>
            <span className="text-[11px] font-medium text-slate-400">
              LTFRB Regulated Rates
            </span>
          </div>

          <div className="space-y-2 text-[13px]">
            <div className="flex items-center justify-between text-[#191C1E]">
              <span className="font-semibold text-slate-600">Base Segment Fare</span>
              <span className="font-bold">₱{fareBreakdown.baseFare.toFixed(2)}</span>
            </div>

            {fareBreakdown.discountAmount > 0 && (
              <>
                <div className="flex items-center justify-between text-[#191C1E]">
                  <span className="font-semibold text-slate-600">
                    {discountLabel || "Concession"} Discount (20%)
                  </span>
                  <span className="font-bold text-emerald-700">-₱{fareBreakdown.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[#191C1E]">
                  <span className="font-semibold text-slate-600">Discounted Base Fare</span>
                  <span className="font-bold">₱{fareBreakdown.discountedBaseFare.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between text-[#191C1E]">
              <span className="font-semibold text-slate-600">Convenience Fee</span>
              <span className="font-bold">₱{fareBreakdown.convenienceFee.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-2 bg-[#ECEEF0]" />

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-[15px] font-extrabold text-[#191C1E]">Total Payment</p>
              <p className="text-[10px] text-slate-400">Includes segment ride + digital fee</p>
            </div>
            <div className="text-right">
              {fareBreakdown.discountAmount > 0 && (
                <span className="text-xs text-slate-400 line-through block font-medium">
                  ₱{(fareBreakdown.baseFare + fareBreakdown.convenienceFee).toFixed(2)}
                </span>
              )}
              <span className="text-[22px] font-black text-[#F95700] tracking-tight">
                ₱{fareBreakdown.totalFare.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </main>

      {/* ── Fixed Bottom Sticky Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.06)] px-4 py-3.5 pb-safe">
        <div className="w-full max-w-[440px] md:max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Total Amount
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[20px] font-black text-[#F95700]">
                ₱{fareBreakdown.totalFare.toFixed(2)}
              </span>
              {fareBreakdown.discountAmount > 0 && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  -20%
                </span>
              )}
            </div>
          </div>

          <Button
            type="button"
            onClick={handleProceedToPayment}
            className="flex-1 py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-extrabold text-[15px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer max-w-xs"
          >
            <span>Proceed to Payment</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-sans">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-500">Loading booking...</p>
          </div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
