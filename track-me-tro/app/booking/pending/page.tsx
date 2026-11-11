"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";

function PendingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bookings, assignSeatToBooking } = useAppContext();

  const bookingId = searchParams.get("id");
  const booking = bookings.find((b) => b.id === bookingId);

  const [conductorAssigning, setConductorAssigning] = useState(false);
  const [seatAssigned, setSeatAssigned] = useState(false);
  const [assignedSeatNum, setAssignedSeatNum] = useState<string | null>(null);

  // Auto-progress dots animation
  const [dots, setDots] = useState("");
  useEffect(() => {
    if (seatAssigned) return;
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [seatAssigned]);

  const handleSimulateAssignment = () => {
    if (!bookingId) return;
    setConductorAssigning(true);

    // Simulate conductor assigning seat after a brief delay
    setTimeout(() => {
      const randomSeat = Math.floor(Math.random() * 24 + 1).toString();
      assignSeatToBooking(bookingId, randomSeat);
      setAssignedSeatNum(randomSeat);
      setSeatAssigned(true);
      setConductorAssigning(false);
    }, 1500);
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-sans">
        <div className="text-center space-y-3 px-6">
          <span className="material-symbols-outlined text-[40px] text-slate-300">error</span>
          <p className="text-sm font-bold text-slate-500">Booking not found</p>
          <button
            type="button"
            onClick={() => router.push("/home")}
            className="px-4 py-2 rounded-full bg-[#F95700] text-white font-bold text-sm cursor-pointer"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const routeLabel = booking.direction === "sogod-ormoc"
    ? "Sogod → Ormoc City"
    : "Ormoc City → Sogod";

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-32">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/home")}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Back to Home"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <h1 className="text-[17px] font-black tracking-tight text-[#191C1E]">Booking Status</h1>
          <p className="text-[11px] font-semibold text-slate-500">
            {seatAssigned ? "Seat Confirmed!" : "Pending Assignment"}
          </p>
        </div>

        <div className="w-10 h-10" />
      </header>

      <main className="max-w-[440px] w-full mx-auto px-4 pt-6 space-y-5">
        {/* Status Icon */}
        <div className="text-center space-y-2">
          {seatAssigned ? (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h2 className="text-[22px] font-black text-[#191C1E]">Seat Assigned!</h2>
              <p className="text-[12px] font-bold text-emerald-700 uppercase tracking-wider">
                CONDUCTOR CONFIRMED • SEAT {assignedSeatNum}
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-[#FFE8D6] text-[#F95700] flex items-center justify-center mx-auto shadow-md animate-pulse">
                <span className="material-symbols-outlined text-[32px]">hourglass_top</span>
              </div>
              <h2 className="text-[22px] font-black text-[#191C1E]">
                Pending Seat Assignment{dots}
              </h2>
              <p className="text-[12px] font-bold text-[#A53700] uppercase tracking-wider">
                WAITING FOR CONDUCTOR
              </p>
            </>
          )}
        </div>

        {/* Booking Reference Card */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-[#ECEEF0] space-y-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 bg-[#F5DECD]/70 text-[#812900] px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider">
              <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
              <span>PNR: {booking.pnr}</span>
            </div>

            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
              seatAssigned
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-amber-50 text-amber-700 border border-amber-200 animate-pulse"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${seatAssigned ? "bg-emerald-500" : "bg-amber-500"}`} />
              {seatAssigned ? "Confirmed" : "Pending"}
            </span>
          </div>

          {/* Trip Details */}
          <div className="bg-[#F7F9FB] rounded-2xl p-3.5 border border-[#ECEEF0] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ROUTE</p>
                <p className="text-[15px] font-black text-[#191C1E]">{routeLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BUS</p>
                <p className="text-[14px] font-black text-[#A53700]">{booking.busNumber}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#ECEEF0]">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">DEPARTURE</p>
                <p className="text-[14px] font-extrabold text-[#191C1E]">{booking.departureTime}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TYPE</p>
                <p className="text-[12px] font-bold text-[#191C1E] capitalize">{booking.passengerType}</p>
              </div>
            </div>
          </div>

          {/* Fare Info */}
          <div className="flex items-center justify-between pt-2 border-t border-[#ECEEF0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E0E3E5] text-slate-700 font-bold text-[11px] flex items-center justify-center">
                {booking.passengerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <span className="text-[13px] font-bold text-[#191C1E]">{booking.passengerName}</span>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-medium">PAID</p>
              <p className="text-[15px] font-black text-[#A53700]">₱{booking.totalFare.toFixed(2)}</p>
            </div>
          </div>

          {seatAssigned && assignedSeatNum && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">event_seat</span>
                <span className="text-[14px] font-black text-emerald-800">Assigned Seat</span>
              </div>
              <div className="inline-flex w-9 h-9 rounded-full bg-emerald-600 text-white items-center justify-center font-black text-[15px] shadow-sm">
                {assignedSeatNum}
              </div>
            </div>
          )}
        </section>

        {/* Info / Action */}
        {!seatAssigned ? (
          <>
            {/* Waiting Message */}
            <div className="bg-[#FFE8D6]/40 border border-[#F5DECD] rounded-2xl p-4 text-center space-y-2">
              <p className="text-[13px] font-bold text-[#A53700]">
                The conductor will assign your seat shortly.
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                You&apos;ll receive your ticket and QR code once a seat is confirmed. Your payment has been secured.
              </p>
            </div>

            {/* Demo: Simulate Conductor Assignment */}
            <button
              type="button"
              disabled={conductorAssigning}
              onClick={handleSimulateAssignment}
              className="w-full py-3.5 rounded-full bg-[#181C24] hover:bg-black text-white font-black text-[14px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 active:scale-[0.98]"
            >
              {conductorAssigning ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Conductor Assigning Seat...</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#F95700]">touch_app</span>
                  <span>Simulate Conductor Assignment (Demo)</span>
                </span>
              )}
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => router.push("/ticket")}
              className="w-full py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] text-white font-black text-[15px] shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">confirmation_number</span>
              <span>View Your Ticket</span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/map")}
              className="w-full py-3 rounded-full bg-[#181C24] hover:bg-black text-white font-bold text-[13px] shadow-xs transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[16px] text-[#F95700]">near_me</span>
              <span>Track Bus on Live Map</span>
            </button>
          </div>
        )}

        {/* Payment Method Tag */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500">
          <span className="material-symbols-outlined text-[15px] text-slate-400">verified_user</span>
          <span>Paid via {booking.paymentMethod} • 256-bit Encrypted</span>
        </div>
      </main>
    </div>
  );
}

export default function PendingBookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Loading booking status...</p>
        </div>
      </div>
    }>
      <PendingContent />
    </Suspense>
  );
}
