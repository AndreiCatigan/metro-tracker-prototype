"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import {
  calculateFare,
  generateAvailableBookingTrips,
  AvailableBookingTrip as AvailableTrip,
} from "@/lib/data";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    passengerName,
    busDetails,
    createBooking,
    simulatedTime,
    verifiedDiscount,
    discountIdNumber,
  } = useAppContext();

  // Read optional pre-selected trip from query params
  const preselectedTripId = searchParams.get("trip");
  const preselectedDirection = (searchParams.get("direction") as "sogod-ormoc" | "ormoc-sogod") || "sogod-ormoc";

  const [direction, setDirection] = useState<"sogod-ormoc" | "ormoc-sogod">(preselectedDirection);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(preselectedTripId);
  const [paymentMethod, setPaymentMethod] = useState<"GCash" | "Maya">("GCash");
  const [step, setStep] = useState<1 | 2>(preselectedTripId ? 2 : 1);
  const [isProcessing, setIsProcessing] = useState(false);

  const trips = useMemo(() => generateAvailableBookingTrips(direction, simulatedTime), [direction, simulatedTime]);
  const selectedTrip = useMemo(() => trips.find((t) => t.id === selectedTripId), [trips, selectedTripId]);

  const fare = useMemo(
    () => calculateFare(busDetails.baseFare, busDetails.convenienceFee, verifiedDiscount),
    [busDetails.baseFare, busDetails.convenienceFee, verifiedDiscount]
  );

  const handleSelectTrip = (trip: AvailableTrip) => {
    setSelectedTripId(trip.id);
    setStep(2);
  };

  const handleBooking = () => {
    if (!selectedTrip) return;
    setIsProcessing(true);
    setTimeout(() => {
      const booking = createBooking({
        tripId: selectedTrip.id,
        busNumber: selectedTrip.busNumber,
        departureTime: selectedTrip.departureTime,
        direction,
        passengerType: verifiedDiscount,
        paymentMethod,
      });
      router.push(`/booking/pending?id=${booking.id}`);
    }, 800);
  };

  // Step 1: Select Trip
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-32">
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
            <h1 className="text-[17px] font-black tracking-tight text-[#191C1E]">Book A Ticket</h1>
            <p className="text-[11px] font-semibold text-slate-500">Step 1 — Select Your Trip</p>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#FFE8D6] text-[#A53700] flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">confirmation_number</span>
          </div>
        </header>

        <main className="max-w-[440px] w-full mx-auto px-4 pt-4 space-y-4">
          {/* Direction Tab */}
          <div className="bg-[#ECEEF0] p-1.5 rounded-2xl flex items-center gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => { setDirection("sogod-ormoc"); setSelectedTripId(null); }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-[12px] tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                direction === "sogod-ormoc"
                  ? "bg-[#181C24] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Sogod</span>
              <span className="text-[#F95700] font-black">→</span>
              <span>Ormoc</span>
            </button>

            <button
              type="button"
              onClick={() => { setDirection("ormoc-sogod"); setSelectedTripId(null); }}
              className={`flex-1 py-2.5 px-3 rounded-xl font-black text-[12px] tracking-tight transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                direction === "ormoc-sogod"
                  ? "bg-[#181C24] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Ormoc</span>
              <span className="text-[#F95700] font-black">→</span>
              <span>Sogod</span>
            </button>
          </div>

          {/* Info Banner */}
          <div className="bg-[#FFE8D6]/60 border border-[#F5DECD] rounded-2xl p-3 flex items-center gap-2.5 text-xs">
            <span className="material-symbols-outlined text-[18px] text-[#F95700]">info</span>
            <p className="text-slate-700 font-medium">
              Online reservation only — <span className="font-black text-[#A53700]">₱{busDetails.baseFare} base + ₱{busDetails.convenienceFee} convenience fee</span>. Your seat will be assigned by the conductor.
            </p>
          </div>

          {/* Available Trips */}
          <div className="space-y-2.5">
            <h3 className="text-[14px] font-black text-[#191C1E] px-1">Available Departures</h3>

            {trips.map((trip) => (
              <button
                key={trip.id}
                type="button"
                onClick={() => handleSelectTrip(trip)}
                className={`w-full bg-white rounded-2xl p-3.5 border shadow-2xs transition-all cursor-pointer text-left active:scale-[0.98] ${
                  trip.status === "boarding"
                    ? "border-[#F95700]/40 ring-1 ring-[#F95700]/20"
                    : "border-[#ECEEF0] hover:border-[#F95700]/30"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[17px] font-black text-[#191C1E]">
                      {trip.departureTime}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      {trip.busNumber}
                    </span>
                    {trip.isAircon ? (
                      <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Aircon
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
                        Non-Air
                      </span>
                    )}
                  </div>

                  {trip.status === "boarding" ? (
                    <span className="inline-flex items-center gap-1 bg-[#FFE8D6] text-[#A53700] px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
                      Boarding
                    </span>
                  ) : trip.status === "in_queue" ? (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200/80 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      In Queue
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Scheduled</span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-3 text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-slate-400">person</span>
                      {trip.driverName}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-emerald-500">event_seat</span>
                      <span className="font-bold text-emerald-700">{trip.availableSeats}</span> seats
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-[#A53700] font-bold">
                    <span className="material-symbols-outlined text-[13px]">schedule</span>
                    ETA {trip.etaAtDestination}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Step 2: Passenger Type + Payment + Confirm
  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-36">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep(1)}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Back"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <h1 className="text-[17px] font-black tracking-tight text-[#191C1E]">Confirm Booking</h1>
          <p className="text-[11px] font-semibold text-slate-500">Step 2 — Details & Payment</p>
        </div>

        <div className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-600 flex items-center justify-center">
          <span className="material-symbols-outlined text-[19px]">lock</span>
        </div>
      </header>

      <main className="max-w-[440px] w-full mx-auto px-4 pt-4 space-y-4">
        {/* Selected Trip Summary */}
        {selectedTrip && (
          <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#ECEEF0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 bg-[#FFE8D6] text-[#A53700] px-3 py-1 rounded-full text-[11px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
                Trip Details
              </span>
              <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                {selectedTrip.busNumber}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">FROM</p>
                <p className="text-[16px] font-black text-[#191C1E]">
                  {direction === "sogod-ormoc" ? "Sogod" : "Ormoc"}
                </p>
              </div>
              <div className="flex flex-col items-center px-3">
                <span className="text-[11px] font-bold text-[#A53700]">{selectedTrip.departureTime}</span>
                <div className="flex items-center gap-1 text-[#A53700]">
                  <span className="w-8 h-[1.5px] bg-[#A53700]" />
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">ETA {selectedTrip.etaAtDestination}</span>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TO</p>
                <p className="text-[16px] font-black text-[#191C1E]">
                  {direction === "sogod-ormoc" ? "Ormoc" : "Sogod"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-[#ECEEF0] text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-slate-400">person</span>
                {selectedTrip.driverName}
              </span>
              {selectedTrip.isAircon ? (
                <span className="text-emerald-700 font-bold">✓ Aircon</span>
              ) : (
                <span className="text-rose-600 font-bold">Non-Aircon</span>
              )}
              <span className="text-emerald-700 font-bold">{selectedTrip.availableSeats} seats left</span>
            </div>
          </section>
        )}

        {/* Passenger Info & Verified Concession Status */}
        <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#ECEEF0] space-y-3.5">
          <div className="flex items-center justify-between pb-3 border-b border-[#ECEEF0]">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PASSENGER</p>
              <p className="text-[15px] font-black text-[#191C1E]">{passengerName}</p>
            </div>

            {verifiedDiscount !== "regular" ? (
              <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-[11px] font-extrabold shadow-2xs">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">verified</span>
                <span className="capitalize">{verifiedDiscount} (20% Off)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-[11px] font-bold">
                <span>Regular Fare</span>
              </span>
            )}
          </div>

          {/* Verification Status Banner */}
          {verifiedDiscount !== "regular" ? (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-3 flex items-start gap-2.5 text-xs">
              <span className="material-symbols-outlined text-[18px] text-emerald-600 shrink-0 mt-0.5">verified_user</span>
              <div className="flex-1 min-w-0">
                <p className="text-emerald-950 font-bold">
                  Verified {verifiedDiscount.toUpperCase()} Account ({discountIdNumber || "ID on file"})
                </p>
                <p className="text-emerald-800 text-[11px] font-medium mt-0.5">
                  20% statutory fare concession is automatically applied to this booking.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 font-medium min-w-0">
                <span className="material-symbols-outlined text-[17px] text-slate-400 shrink-0">badge</span>
                <span className="truncate">Eligible for 20% Student, Senior, or PWD discount?</span>
              </div>
              <button
                type="button"
                onClick={() => router.push("/profile")}
                className="text-[11px] font-black text-[#F95700] hover:underline whitespace-nowrap cursor-pointer shrink-0"
              >
                Verify in Profile →
              </button>
            </div>
          )}

          {/* Seat Assignment Notice */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3 text-xs flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-amber-600 mt-0.5 shrink-0">info</span>
            <p className="text-amber-800 font-medium">
              Your seat will be assigned by the conductor after booking. You&apos;ll receive your ticket details once confirmed.
            </p>
          </div>
        </section>

        {/* Fare Breakdown */}
        <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#ECEEF0] space-y-3">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">FARE BREAKDOWN</h3>

          <div className="space-y-2 text-[13px]">
            <div className="flex items-center justify-between text-[#191C1E]">
              <span className="font-semibold text-slate-600">Base Fare</span>
              <span className="font-bold">₱{fare.baseFare.toFixed(2)}</span>
            </div>

            {fare.discount > 0 && (
              <div className="flex items-center justify-between text-emerald-700">
                <span className="font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">discount</span>
                  Verified {verifiedDiscount.charAt(0).toUpperCase() + verifiedDiscount.slice(1)} Discount (20%)
                </span>
                <span className="font-bold">-₱{fare.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex items-center justify-between text-[#191C1E]">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-600">Convenience Fee</span>
                <span className="bg-[#ECEEF0] text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                  Digital
                </span>
              </div>
              <span className="font-bold">₱{fare.convenienceFee.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-dashed border-[#ECEEF0] flex items-center justify-between">
            <p className="text-[15px] font-extrabold text-[#191C1E]">Total</p>
            <div className="text-[22px] font-black text-[#A53700] tracking-tight">
              ₱{fare.totalFare.toFixed(2)}
            </div>
          </div>
        </section>

        {/* Payment Method */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PAY WITH (ONLINE ONLY)
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              <span>E-Wallet</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => setPaymentMethod("GCash")}
            className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
              paymentMethod === "GCash"
                ? "bg-white border-2 border-[#F95700] ring-1 ring-[#F95700]/30 shadow-xs"
                : "bg-white border border-[#ECEEF0] hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#005CEE] text-white flex items-center justify-center font-black text-[13px] shadow-xs">
                GCash
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#191C1E]">GCash</p>
                <p className="text-[11px] text-slate-400 font-medium">Connected • 0912***6781</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "GCash" ? "border-[#F95700]" : "border-slate-300"
            }`}>
              {paymentMethod === "GCash" && <div className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("Maya")}
            className={`w-full p-3.5 rounded-2xl flex items-center justify-between transition-all cursor-pointer text-left ${
              paymentMethod === "Maya"
                ? "bg-white border-2 border-[#F95700] ring-1 ring-[#F95700]/30 shadow-xs"
                : "bg-white border border-[#ECEEF0] hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#00D06C] text-slate-900 flex items-center justify-center font-black text-[11px] shadow-xs lowercase tracking-tight">
                maya
              </div>
              <div>
                <p className="text-[14px] font-extrabold text-[#191C1E]">Maya</p>
                <p className="text-[11px] text-slate-400 font-medium">Pay via Maya Wallet or QR</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "Maya" ? "border-[#F95700]" : "border-slate-300"
            }`}>
              {paymentMethod === "Maya" && <div className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />}
            </div>
          </button>
        </section>

        {/* Security */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 py-1">
          <span className="material-symbols-outlined text-[15px] text-slate-400">verified_user</span>
          <span>256-bit encrypted • LTFRB Transit Partner</span>
        </div>
      </main>

      {/* Fixed Bottom Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.06)] px-4 py-3.5">
        <div className="max-w-[440px] mx-auto space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-semibold">Total Payment</span>
            <span className="text-[17px] font-black text-[#F95700]">₱{fare.totalFare.toFixed(2)}</span>
          </div>

          <button
            type="button"
            disabled={isProcessing || !selectedTrip}
            onClick={handleBooking}
            className="w-full py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-extrabold text-[15px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-wait"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Pay ₱{fare.totalFare.toFixed(2)} & Reserve</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F7F9FB] flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-3 border-[#F95700] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-500">Loading booking...</p>
        </div>
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
