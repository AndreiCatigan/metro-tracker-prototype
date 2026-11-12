"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/lib/AppContext";
import { POS_ROUTE_STOPS } from "@/lib/data";

function PosContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const seatId = searchParams.get("seat") || "15";
  const { busDetails, updateSeatStatus } = useAppContext();

  const routeStops = POS_ROUTE_STOPS;

  const [selectedStopId, setSelectedStopId] = useState("baybay");
  const [discountType, setDiscountType] = useState<"regular" | "discount">("regular");
  const [isPrinting, setIsPrinting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const activeStop = routeStops.find((s) => s.id === selectedStopId) || routeStops[0];
  const calculatedFare =
    discountType === "regular"
      ? activeStop.baseFare
      : Math.round(activeStop.baseFare * 0.8);

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      setIsPrinting(false);
      setShowReceipt(true);
      // Mark seat as occupied in AppContext
      updateSeatStatus(seatId, "occupied");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F7F9FB] text-[#191C1E] flex flex-col font-sans pb-16">
      {/* ── Top Header ── */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#ECEEF0] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push("/conductor/matrix")}
          className="w-10 h-10 rounded-full bg-[#F2F4F6] text-slate-700 flex items-center justify-center hover:bg-[#E6E8EA] transition active:scale-95 cursor-pointer"
          aria-label="Back to Matrix"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
        </button>

        <div className="text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            CONDUCTOR TERMINAL
          </p>
          <h1 className="text-[17px] font-black tracking-tight text-[#191C1E]">
            Cash Ticketing
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 bg-[#FFE8D6] text-[#A53700] px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A53700] animate-pulse" />
            <span>LIVE POS</span>
          </span>
          <div className="w-8 h-8 rounded-full bg-[#812900] text-white flex items-center justify-center font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">person</span>
          </div>
        </div>
      </header>

      {/* ── Mini Status Strip ── */}
      <div className="max-w-[420px] w-full mx-auto px-4 pt-2.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 bg-white border border-[#ECEEF0] rounded-xl px-3 py-1.5 shadow-2xs">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#A53700]" />
            <span>ROUTE 04 {busDetails.id}</span>
          </span>
          <span className="bg-[#E0E8F0] text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold">
            Standard • Window
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-bold">
            <span>ESC/POS 98%</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </span>
        </div>
      </div>

      <main className="max-w-[420px] w-full mx-auto px-4 pt-3 space-y-3.5">
        {/* ── Passenger Seat Badge ── */}
        <section className="bg-white rounded-2xl p-3.5 shadow-2xs border border-[#ECEEF0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#101A2C] text-white flex items-center justify-center font-black text-[17px] shadow-xs">
              {seatId}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                PASSENGER SEAT
              </p>
              <h2 className="text-[16px] font-black text-[#191C1E]">
                Walk-in: Seat {seatId}
              </h2>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#F2F4F6] text-slate-500 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">airline_seat_recline_normal</span>
          </div>
        </section>

        {/* ── SELECT DESTINATION Section ── */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-wider">
              SELECT DESTINATION
            </h3>
            <span className="flex items-center gap-1 text-[11px] text-[#A53700] font-bold">
              <span className="material-symbols-outlined text-[13px]">navigation</span>
              <span>Upcoming route stops</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {routeStops.map((stop) => {
              const isSelected = selectedStopId === stop.id;

              return (
                <button
                  key={stop.id}
                  type="button"
                  onClick={() => setSelectedStopId(stop.id)}
                  className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#101A2C] text-white shadow-md ring-2 ring-[#F95700]"
                      : "bg-white border border-[#ECEEF0] text-[#191C1E] hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] font-black">{stop.name}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#F95700] text-white flex items-center justify-center text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[11px] font-medium mt-0.5 ${
                      isSelected ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {stop.distance} {stop.tag && `• ${stop.tag}`}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ── FARE COMPUTATION Card ── */}
        <section className="bg-white rounded-3xl p-5 shadow-xs border border-[#ECEEF0] space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              FARE COMPUTATION
            </span>
            <span className="flex items-center gap-1 bg-[#FFE8D6] text-[#A53700] px-2.5 py-0.5 rounded-full text-[10px] font-black">
              <span className="material-symbols-outlined text-[12px]">location_searching</span>
              <span>GPS Locked</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between border-b border-[#ECEEF0] pb-3">
            <div>
              <p className="text-[14px] font-black text-[#191C1E]">Amount Due</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">info</span>
                <span>Calculated from GPS: Sogod Terminal</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-[26px] font-black text-[#101A2C] tracking-tight leading-none">
                ₱ {calculatedFare.toFixed(2)}
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                Sogod Terminal
              </p>
            </div>
          </div>

          {/* Route Info Chips */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 bg-[#F7F9FB] rounded-xl p-2 px-3">
            <span>Dist: {activeStop.distance}</span>
            <span className="text-slate-300">•</span>
            <span>To: {activeStop.name}</span>
            <span className="text-slate-300">•</span>
            <span className="capitalize">{discountType}</span>
          </div>

          {/* Passenger Classification Toggle */}
          <div className="space-y-1.5">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
              PASSENGER CLASSIFICATION
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDiscountType("regular")}
                className={`py-3 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  discountType === "regular"
                    ? "bg-[#E0E8F0] text-slate-900 border border-slate-300 shadow-2xs"
                    : "bg-[#F7F9FB] text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">person</span>
                <span>Regular (₱{activeStop.baseFare.toFixed(2)})</span>
              </button>

              <button
                type="button"
                onClick={() => setDiscountType("discount")}
                className={`py-3 px-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  discountType === "discount"
                    ? "bg-[#E0E8F0] text-slate-900 border border-slate-300 shadow-2xs"
                    : "bg-[#F7F9FB] text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">school</span>
                <span>Discount 20% (₱{(activeStop.baseFare * 0.8).toFixed(2)})</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── Primary Action CTA ── */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            disabled={isPrinting}
            onClick={handlePrint}
            className="w-full py-4 px-4 rounded-full bg-[#A53700] hover:bg-[#812900] active:scale-[0.98] text-white font-black text-[15px] shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            {isPrinting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Printing 58mm Thermal Ticket...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">bluetooth</span>
                <span>Collect Cash &amp; Print</span>
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </span>
            )}
          </button>
          <p className="text-[10px] text-slate-400 text-center font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block mr-1" />
            ESC/POS Thermal 58mm Sync • Instant LTFRB e-ticket transaction logged
          </p>
        </div>
      </main>

      {/* ── Printed Receipt Modal ── */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-fade-in font-mono text-xs text-slate-800">
            <div className="text-center pb-2 border-b border-dashed border-slate-300">
              <p className="font-sans font-black text-base text-[#191C1E]">
                track <span className="text-[#F95700]">ME</span>tro
              </p>
              <p className="text-[10px] text-slate-500">LTFRB OFFICIAL CASH TICKET</p>
              <p className="text-[9px] text-slate-400">BUS DMS-048 • CONDUKTOR #8842</p>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span>SEAT:</span>
                <span className="font-bold text-[#F95700]">SEAT {seatId} (WINDOW)</span>
              </div>
              <div className="flex justify-between">
                <span>ORIGIN:</span>
                <span>SOGOD TERMINAL</span>
              </div>
              <div className="flex justify-between">
                <span>DESTINATION:</span>
                <span className="font-bold">{activeStop.name.toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span>CLASS:</span>
                <span className="uppercase">{discountType}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-dashed border-slate-300 text-sm font-black">
                <span>CASH PAID:</span>
                <span>₱{calculatedFare.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-slate-400">
              <p>*** VALID BOARDING PASS ***</p>
              <p className="text-[9px]">Thank you for commuting with us!</p>
            </div>

            <button
              type="button"
              onClick={() => router.push("/conductor/matrix")}
              className="w-full py-3 bg-[#A53700] text-white rounded-xl font-sans font-black text-xs hover:bg-[#812900] transition cursor-pointer"
            >
              Done &bull; Back to Seat Matrix ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PosPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading POS...</div>}>
      <PosContent />
    </Suspense>
  );
}
