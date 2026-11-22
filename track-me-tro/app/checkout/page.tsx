"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import { calculateSegmentFare } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  const router = useRouter();
  const {
    busDetails,
    passengerName,
    createBooking,
    origin,
    destination,
    selectedDirection,
    verifiedDiscount,
    isPremium,
  } = useAppContext();

  const [paymentMethod, setPaymentMethod] = useState<"GCash" | "Maya">("GCash");
  const [isProcessing, setIsProcessing] = useState(false);

  const fare = useMemo(() => {
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

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate instantaneous payment processing
    setTimeout(() => {
      const booking = createBooking({
        busNumber: busDetails.id,
        direction: selectedDirection === "sogod-to-ormoc" ? "sogod-ormoc" : "ormoc-sogod",
        passengerType: verifiedDiscount,
        paymentMethod,
        origin,
        destination,
        etaMinutes: 12,
        etaText: "Arriving in ~12 mins",
        paymentStatus: "paid",
      });
      router.push(`/booking/pending?id=${booking.id}`);
    }, 800);
  };

  return (
    <div className="min-h-dvh bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-cta-safe overflow-x-hidden">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0]">
        <div className="w-full max-w-[440px] md:max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
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
              Checkout &amp; Payment
            </h1>
            <p className="text-[11px] font-medium text-slate-500">
              Secure Digital Fare Payment
            </p>
          </div>

          <div className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-[19px]">lock</span>
          </div>
        </div>
      </header>

      <main className="w-full max-w-[440px] md:max-w-2xl mx-auto px-4 pt-4 space-y-4">
        {/* ── Card 1: Booking Details ── */}
        <Card className="p-5 shadow-xs border-[#ECEEF0] space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 bg-[#FFE8D6] text-[#A53700] px-3 py-1 rounded-full text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
              Booking Summary
            </span>
            <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase">
              BUS {busDetails.id}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A53700] uppercase tracking-wider mb-0.5">
                <span className="w-2 h-2 rounded-full bg-[#A53700]" />
                Route Segment
              </div>
              <h2 className="text-[18px] font-black text-[#191C1E] tracking-tight">
                {origin} <span className="text-slate-400 font-normal">➔</span> {destination}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => router.push("/booking")}
              className="text-[11px] font-bold text-[#F95700] hover:underline cursor-pointer"
            >
              Edit Route
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#ECEEF0]">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                DEPARTURE &amp; DATE
              </p>
              <p className="text-[13px] font-extrabold text-[#191C1E]">
                Today • 08:00 AM
              </p>
              <p className="text-[11px] text-slate-400 font-medium">Nov 24, 2026 • Aircon Express</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                SEAT ASSIGNMENT
              </p>
              <Badge variant="peach" className="gap-1 font-bold text-[11px] py-1 px-3 shadow-2xs">
                <span className="material-symbols-outlined text-[13px]">airline_seat_recline_normal</span>
                <span>To be assigned by conductor</span>
              </Badge>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Assigned upon payment confirmation
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#ECEEF0]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#E0E3E5] text-slate-700 font-bold text-[11px] flex items-center justify-center">
                {passengerName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <span className="text-[13px] font-bold text-[#191C1E]">
                {passengerName}
              </span>
            </div>
            {verifiedDiscount !== "regular" ? (
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {discountLabel} (20%)
              </span>
            ) : (
              <span className="text-[11px] font-medium text-slate-400">
                Regular Ticket
              </span>
            )}
          </div>
        </Card>

        {/* ── Card 2: Fare Breakdown ── */}
        <Card className="p-5 shadow-xs border-[#ECEEF0] space-y-3">
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
              <span className="font-bold">₱{fare.baseFare.toFixed(2)}</span>
            </div>

            {fare.discountAmount > 0 && (
              <>
                <div className="flex items-center justify-between text-[#191C1E]">
                  <span className="font-semibold text-slate-600">
                    {discountLabel || "Concession"} Discount (20%)
                  </span>
                  <span className="font-bold text-emerald-700">-₱{fare.discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-[#191C1E]">
                  <span className="font-semibold text-slate-600">Discounted Base Fare</span>
                  <span className="font-bold">₱{fare.discountedBaseFare.toFixed(2)}</span>
                </div>
              </>
            )}

            <div className="flex items-center justify-between text-[#191C1E]">
              <span className="font-semibold text-slate-600">Convenience Fee</span>
              <span className="font-bold">₱{fare.convenienceFee.toFixed(2)}</span>
            </div>
          </div>

          <Separator className="my-2 bg-[#ECEEF0]" />

          <div className="flex items-center justify-between pt-1">
            <div>
              <p className="text-[15px] font-extrabold text-[#191C1E]">Total Amount</p>
              <p className="text-[10px] text-slate-400">Includes all taxes and convenience fees</p>
            </div>
            <div className="text-[22px] font-black text-[#191C1E] tracking-tight">
              ₱{fare.totalFare.toFixed(2)}
            </div>
          </div>
        </Card>

        {/* ── Section 3: Pay With ── */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              PAY WITH
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              <span className="material-symbols-outlined text-[13px]">check_circle</span>
              <span>Instant E-Wallet</span>
            </span>
          </div>

          {/* GCash Option */}
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
                <p className="text-[11px] text-slate-400 font-medium">
                  Connected account • 0912***6781
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "GCash"
                  ? "border-[#F95700]"
                  : "border-slate-300"
              }`}
            >
              {paymentMethod === "GCash" && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />
              )}
            </div>
          </button>

          {/* Maya Option */}
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
                <p className="text-[11px] text-slate-400 font-medium">
                  Pay via Maya Wallet or QR
                </p>
              </div>
            </div>

            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                paymentMethod === "Maya"
                  ? "border-[#F95700]"
                  : "border-slate-300"
              }`}
            >
              {paymentMethod === "Maya" && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#F95700]" />
              )}
            </div>
          </button>
        </section>

        {/* Security Tag */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-500 py-1">
          <span className="material-symbols-outlined text-[15px] text-slate-400">verified_user</span>
          <span>256-bit encrypted • LTFRB Transit Partner</span>
        </div>
      </main>

      {/* ── Fixed Bottom Sticky Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#ECEEF0] shadow-[0_-6px_24px_rgba(0,0,0,0.06)] px-4 py-3.5 pb-safe">
        <div className="w-full max-w-[440px] md:max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              Final Payment Due
            </span>
            <span className="text-[20px] font-black text-[#F95700]">
              ₱{fare.totalFare.toFixed(2)}
            </span>
          </div>

          <Button
            type="button"
            disabled={isProcessing}
            onClick={handlePay}
            className="flex-1 py-3.5 rounded-full bg-[#F95700] hover:bg-[#E04E00] active:scale-[0.98] text-white font-extrabold text-[15px] shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75 disabled:cursor-wait max-w-xs"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Payment...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Pay ₱{fare.totalFare.toFixed(2)}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
