"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import { useIsHydrated } from "@/lib/hooks/useLocalStorageState";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings, assignSeatToBooking, seats, busDetails } = useAppContext();

  const bookingId = searchParams.get("id");
  const currentBooking = useMemo(() => {
    if (bookingId) {
      const found = bookings.find((b) => b.id === bookingId);
      if (found) return found;
    }
    return bookings.length > 0 ? bookings[bookings.length - 1] : undefined;
  }, [bookings, bookingId]);

  // Live countdown ticker adhering to React 19 lint rules
  const [etaMinutes, setEtaMinutes] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setEtaMinutes((prev) => (prev > 1 ? prev - 1 : 1));
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const isHydrated = useIsHydrated();
  const estimatedClockTime = useMemo(() => {
    if (!isHydrated) return "08:12 AM";
    const target = new Date();
    target.setMinutes(target.getMinutes() + etaMinutes);
    return target.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
  }, [etaMinutes, isHydrated]);

  const [simulating, setSimulating] = useState(false);

  const handleSimulateAssignment = () => {
    if (!currentBooking) return;
    setSimulating(true);
    setTimeout(() => {
      // Find an available seat or fallback to Seat 14
      const nextSeat = seats.find((s) => s.status === "available")?.id || "14";
      assignSeatToBooking(currentBooking.id, nextSeat);
      setSimulating(false);
    }, 900);
  };

  if (!currentBooking) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-sans">
        <div className="text-center space-y-3 px-6 max-w-sm">
          <span className="material-symbols-outlined text-[42px] text-slate-300">error</span>
          <p className="text-sm font-bold text-slate-600">No active booking found</p>
          <Button
            type="button"
            onClick={() => router.push("/home")}
            className="w-full rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-bold"
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  const isConfirmed = currentBooking.status === "confirmed" && Boolean(currentBooking.assignedSeat);
  const busNumber = currentBooking.busNumber || busDetails.id;
  const originStop = currentBooking.origin || (currentBooking.direction === "sogod-ormoc" ? "Sogod Terminal" : "Ormoc City");
  const destStop = currentBooking.destination || (currentBooking.direction === "sogod-ormoc" ? "Ormoc City" : "Sogod Terminal");

  return (
    <div className="min-h-dvh bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-24 pb-safe overflow-x-hidden">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0]">
        <div className="w-full max-w-[440px] md:max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
            aria-label="Back to Home"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>

          <div className="text-center">
            <h1 className="text-[17px] font-black tracking-tight text-[#191C1E]">
              {isConfirmed ? "Seat Confirmed" : "Booking Status"}
            </h1>
            <p className="text-[11px] font-semibold text-slate-500">
              {isConfirmed ? "Ready for Boarding" : "Awaiting Seat Assignment"}
            </p>
          </div>

          <div className="w-10 h-10" />
        </div>
      </header>

      <main className="w-full max-w-[440px] md:max-w-2xl mx-auto px-4 pt-6 space-y-5">
        {!isConfirmed ? (
          /* ══════════════════════════════════════════════════════════
             STAGE A: Payment Successful & Pending Seat Assignment
             ══════════════════════════════════════════════════════════ */
          <>
            {/* ── Payment Confirmation Hero ── */}
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[34px]">check</span>
              </div>
              <h2 className="text-[24px] font-black tracking-tight text-[#191C1E]">
                Payment Successful!
              </h2>
              <p className="text-[13px] font-bold text-emerald-800">
                ₱{currentBooking.totalFare.toFixed(2)} paid via {currentBooking.paymentMethod}
              </p>
              <div className="flex items-center justify-center gap-2 pt-0.5">
                <span className="text-[12px] font-semibold text-slate-500">
                  {originStop} <span className="text-slate-400 font-normal">➔</span> {destStop}
                </span>
                <span className="text-slate-300">•</span>
                <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                  PNR: {currentBooking.pnr}
                </span>
              </div>
            </div>

            {/* ── Pending Seat Card ── */}
            <Card className="p-5 shadow-xs border-[#ECEEF0] space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="peach" className="gap-1.5 font-extrabold text-[11px] py-1 px-3">
                  <span className="w-2 h-2 rounded-full bg-[#F95700] animate-ping" />
                  <span>PENDING SEAT ASSIGNMENT</span>
                </Badge>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  BUS {busNumber}
                </span>
              </div>

              <div className="bg-[#FFE8D6]/40 border border-[#F5DECD] rounded-2xl p-4 text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-[22px] animate-spin">
                    progress_activity
                  </span>
                </div>
                <p className="text-[13px] font-black text-[#A53700]">
                  Your payment is confirmed. Please wait while the conductor on Bus {busNumber} selects your seat.
                </p>
                <p className="text-[11px] text-slate-500 font-medium">
                  This screen updates automatically in real-time once the conductor marks your seat on the bus matrix.
                </p>
              </div>

              {/* Booking Reference Details */}
              <div className="bg-[#F8FAFC] rounded-2xl p-3.5 border border-[#ECEEF0] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Passenger</span>
                  <span className="font-bold text-[#191C1E]">{currentBooking.passengerName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Ticket Type</span>
                  <span className="font-bold text-[#191C1E] capitalize">
                    {currentBooking.passengerType === "regular" ? "Regular Fare" : `${currentBooking.passengerType} (20% Off)`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Scheduled Departure</span>
                  <span className="font-bold text-[#191C1E]">{currentBooking.departureTime}</span>
                </div>
              </div>

              {/* Presentation Demo Fallback Trigger */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={simulating}
                  onClick={handleSimulateAssignment}
                  className="w-full py-3.5 rounded-full bg-[#181C24] hover:bg-black active:scale-[0.98] text-white font-extrabold text-[14px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-75"
                >
                  {simulating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Assigning Seat...</span>
                    </>
                  ) : (
                    <>
                      <span>Next</span>
                      <span className="material-symbols-outlined text-[18px] text-[#F95700]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </Card>
          </>
        ) : (
          /* ══════════════════════════════════════════════════════════
             STAGE B: Seat Assigned & Bus Arrival Wait Screen
             ══════════════════════════════════════════════════════════ */
          <>
            {/* ── Seat Number Callout Card ── */}
            <Card className="p-6 shadow-md border-emerald-200 bg-white text-center space-y-3">
              <div className="inline-flex justify-center">
                <Badge variant="success" className="gap-1.5 font-black text-[12px] py-1 px-3.5 tracking-wider">
                  <span className="material-symbols-outlined text-[15px]">verified</span>
                  <span>SEAT CONFIRMED</span>
                </Badge>
              </div>

              <div className="space-y-1">
                <p className="text-[13px] font-bold text-slate-500 uppercase tracking-widest">
                  YOUR ASSIGNED SEAT
                </p>
                <h2 className="text-[32px] sm:text-[36px] font-black tracking-tight text-[#191C1E]">
                  Your seat is number{" "}
                  <span className="text-[#F95700] underline decoration-[#FFE8D6] decoration-4">
                    {currentBooking.assignedSeat}
                  </span>
                </h2>
                <p className="text-[12px] font-bold text-emerald-700">
                  Conductor confirmed on Bus {busNumber}
                </p>
              </div>

              <Separator className="my-3 bg-[#ECEEF0]" />

              <div className="flex items-center justify-around text-xs pt-1">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PASSENGER</p>
                  <p className="font-extrabold text-[#191C1E]">{currentBooking.passengerName}</p>
                </div>
                <div className="w-[1px] h-6 bg-slate-200" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PNR CODE</p>
                  <p className="font-mono font-bold text-[#A53700]">{currentBooking.pnr}</p>
                </div>
                <div className="w-[1px] h-6 bg-slate-200" />
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">STATUS</p>
                  <p className="font-bold text-emerald-700">Confirmed</p>
                </div>
              </div>
            </Card>

            {/* ── Bus Arrival & ETA Card ── */}
            <Card className="p-5 shadow-xs border-[#ECEEF0] space-y-3.5 bg-gradient-to-br from-white to-[#FFF9F5]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FFE8D6] text-[#F95700] flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">directions_bus</span>
                </div>
                <div>
                  <p className="text-[14px] font-black text-[#191C1E]">
                    Please wait for Bus No. <span className="text-[#F95700]">{busNumber}</span> to arrive
                  </p>
                  <p className="text-[11.5px] font-bold text-slate-600">
                    Boarding Stop: <span className="text-[#191C1E]">{originStop}</span>
                  </p>
                </div>
              </div>

              {/* Estimated Arrival Block */}
              <div className="bg-white rounded-2xl p-4 border border-[#ECEEF0] flex items-center justify-between shadow-2xs">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ESTIMATED ARRIVAL
                  </p>
                  <p className="text-[20px] font-black text-[#A53700] tracking-tight">
                    Arriving in ~{etaMinutes} mins
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium" suppressHydrationWarning>
                    Est. arrival at {estimatedClockTime}
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE GPS
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    Route 70 Corridor
                  </p>
                </div>
              </div>

              {/* Corridor segment summary */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Route: <strong>{originStop} ➔ {destStop}</strong></span>
                <span className="font-bold text-[#191C1E]">Paid: ₱{currentBooking.totalFare.toFixed(2)}</span>
              </div>
            </Card>

            {/* ── Next Actions ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <Button
                type="button"
                onClick={() => router.push("/ticket")}
                className="w-full py-4 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-extrabold text-[15px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[19px]">qr_code_2</span>
                <span>View Boarding Pass (QR)</span>
              </Button>

              <button
                type="button"
                onClick={() => router.push("/map")}
                className="w-full py-4 rounded-full bg-white hover:bg-slate-50 active:scale-[0.98] text-slate-800 font-extrabold text-[14px] border border-slate-200 shadow-2xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px] text-[#F95700]">near_me</span>
                <span>Track Bus Live on Map</span>
              </button>
            </div>
          </>
        )}

        {/* Security / Verification Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 pt-2">
          <span className="material-symbols-outlined text-[15px] text-slate-400">verified_user</span>
          <span>Verified Transit Reservation • LTFRB Route 70</span>
        </div>
      </main>
    </div>
  );
}

export default function PendingBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-sans">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-500">Loading booking status...</p>
          </div>
        </div>
      }
    >
      <PendingContent />
    </Suspense>
  );
}
